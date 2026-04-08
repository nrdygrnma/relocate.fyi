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

  try {
    // Delete related steps and eligibility rules first (if they exist)
    await prisma.step.deleteMany({ where: { pathwayId: id } })
    await prisma.eligibilityRule.deleteMany({ where: { pathwayId: id } })

    await prisma.pathway.delete({
      where: { id }
    })

    return { success: true }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete pathway'
    })
  }
})
