import { createError, defineEventHandler } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing step ID'
    })
  }

  await prisma.step.delete({
    where: { id }
  })

  return { success: true }
})
