import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    name,
    slug,
    destinationProfileId,
    officialName,
    summary,
    pathwayType,
    published,
    durationYears,
    renewable,
    renewalDetail,
    leadsToPr,
    prTimelineYears,
    dependentsAllowed,
    dependentTypes,
    workAllowed,
    stayRequirementDaysPA,
    propertyPurchaseRequired,
    propertyMinValueUsd,
    applicationStages,
    processingWeeksMin,
    processingWeeksMax,
    inPersonRequired,
    governmentFee,
    governmentFeeUsd,
    currencyCode,
    processNotes,
    sourceUrl
  } = body

  if (!name || !slug || !destinationProfileId || !pathwayType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, slug, destinationProfileId, pathwayType'
    })
  }

  try {
    // If destinationProfileId is an ISO code, we need to find/create the profile
    let finalProfileId = destinationProfileId
    if (destinationProfileId.length <= 3) {
      const country = await prisma.country.findUnique({
        where: { isoCode: destinationProfileId },
        include: { destinationProfile: true }
      })

      if (country && country.destinationProfile) {
        finalProfileId = country.destinationProfile.id
      } else {
        // We need to create the country and destination profile from reference data
        const ref = await prisma.countryReference.findUnique({
          where: { isoCode: destinationProfileId },
          include: { currency: true, languagePrimary: true }
        })

        if (!ref) {
          throw createError({
            statusCode: 404,
            statusMessage: `Country reference for ${destinationProfileId} not found`
          })
        }

        const newCountry = await prisma.country.create({
          data: {
            name: ref.name,
            isoCode: ref.isoCode,
            region: ref.region || 'other',
            currencyCode: ref.currency?.code,
            languagePrimary: ref.languagePrimary?.name,
            hasDestinationProfile: true,
            published: false,
            destinationProfile: {
              create: {
                slug: `${ref.name.toLowerCase().replace(/ /g, '-')}-destination`,
                summary: `Destination profile for ${ref.name}`
              }
            }
          },
          include: { destinationProfile: true }
        })
        finalProfileId = newCountry.destinationProfile!.id
      }
    }

    // Ensure slug is unique by appending an incrementing counter if needed
    let uniqueSlug = slug
    let attempt = 0
    while (await prisma.pathway.findUnique({ where: { slug: uniqueSlug } })) {
      attempt++
      uniqueSlug = `${slug}-${attempt}`
    }

    const pathway = await prisma.pathway.create({
      data: {
        name,
        slug: uniqueSlug,
        destinationProfileId: finalProfileId,
        officialName,
        summary,
        pathwayType,
        published: published || false,
        durationYears,
        renewable: renewable || false,
        renewalDetail,
        leadsToPr: leadsToPr || false,
        prTimelineYears,
        dependentsAllowed: dependentsAllowed || false,
        dependentTypes,
        workAllowed: workAllowed || 'no',
        stayRequirementDaysPA,
        propertyPurchaseRequired: propertyPurchaseRequired || false,
        propertyMinValueUsd,
        applicationStages,
        processingWeeksMin,
        processingWeeksMax,
        inPersonRequired: inPersonRequired || false,
        governmentFee,
        governmentFeeUsd,
        currencyCode,
        processNotes,
        sourceUrl
      },
      include: {
        destinationProfile: {
          include: {
            country: true
          }
        }
      }
    })

    return pathway
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Pathway with this slug already exists'
        })
      }
    }
    throw e
  }
})
