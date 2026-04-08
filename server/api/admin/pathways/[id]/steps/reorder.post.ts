import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../../../db/client'

export default defineEventHandler(async (event) => {
  const pathwayId = event.context.params?.id
  const body = await readBody(event)

  if (!pathwayId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing pathway ID'
    })
  }

  const { steps } = body
  if (!Array.isArray(steps)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid steps data'
    })
  }

  try {
    const OFFSET = 100000
    // Phase 1: shift all to a safe temporary range to avoid unique constraint conflicts
    await prisma.$transaction(
      steps.map((s: { id: string; orderIndex: number }) =>
        prisma.step.update({
          where: { id: s.id },
          data: { orderIndex: s.orderIndex + OFFSET }
        })
      )
    )
    // Phase 2: set final values
    await prisma.$transaction(
      steps.map((s: { id: string; orderIndex: number }) =>
        prisma.step.update({
          where: { id: s.id },
          data: { orderIndex: s.orderIndex }
        })
      )
    )

    return { success: true }
  } catch (e) {
    console.error('Failed to reorder steps:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reorder steps'
    })
  }
})
