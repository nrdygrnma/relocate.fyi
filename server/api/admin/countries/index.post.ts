import prisma from '../../../db/client'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    name,
    isoCode,
    region,
    currencyCode,
    languagePrimary,
    hasDestinationProfile,
    hasOriginProfile
  } = body

  try {
    const country = await prisma.country.create({
      data: {
        name,
        isoCode,
        region: region.toLowerCase(),
        currencyCode,
        languagePrimary,
        hasDestinationProfile,
        hasOriginProfile,
        published: false,
        destinationProfile: hasDestinationProfile
          ? {
              create: {
                slug: `${name.toLowerCase().replace(/ /g, '-')}-destination`,
                summary: `Destination profile for ${name}`
              }
            }
          : undefined,
        originProfile: hasOriginProfile
          ? {
              create: {
                slug: `${name.toLowerCase().replace(/ /g, '-')}-origin`,
                summary: `Origin profile for ${name}`
              }
            }
          : undefined
      },
      include: {
        destinationProfile: true,
        originProfile: true
      }
    })

    return country
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        const target = (e.meta?.target as string[]) || []
        throw createError({
          statusCode: 409,
          statusMessage: `Country already exists with this ${target.join(' or ')}`
        })
      }
    }
    throw e
  }
})
