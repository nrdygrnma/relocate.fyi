import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing pathway ID'
    })
  }

  try {
    const pathway = await prisma.pathway.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
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
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update pathway'
    })
  }
})
