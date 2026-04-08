import { createError, defineEventHandler } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing pathway ID'
    })
  }

  const pathway = await prisma.pathway.findUnique({
    where: { id },
    include: {
      destinationProfile: {
        include: {
          country: true
        }
      },
      steps: {
        orderBy: { orderIndex: 'asc' }
      },
      eligibilityRules: true
    }
  })

  if (!pathway) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pathway not found'
    })
  }

  return pathway
})
