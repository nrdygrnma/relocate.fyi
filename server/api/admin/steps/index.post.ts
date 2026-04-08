import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.pathwayId || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // If no orderIndex provided, or to avoid conflicts, append after the current last step
  const maxOrder = await prisma.step.aggregate({
    where: { pathwayId: body.pathwayId },
    _max: { orderIndex: true }
  })
  const nextOrderIndex =
    body.orderIndex !== undefined
      ? Math.max(body.orderIndex, (maxOrder._max.orderIndex ?? -1) + 1)
      : (maxOrder._max.orderIndex ?? -1) + 1

  const step = await prisma.step.create({
    data: {
      pathwayId: body.pathwayId,
      orderIndex: nextOrderIndex,
      title: body.title,
      description: body.description,
      category: body.category || 'other',
      typicalDurationDays: body.typicalDurationDays,
      validityDays: body.validityDays,
      dependsOn: body.dependsOn,
      mustCompleteBefore: body.mustCompleteBefore,
      officialUrl: body.officialUrl,
      cost: body.cost,
      costUsd: body.costUsd,
      currencyCode: body.currencyCode,
      originSide: body.originSide || false
    }
  })

  return step
})
