import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing step ID'
    })
  }

  const step = await prisma.step.update({
    where: { id },
    data: {
      orderIndex: body.orderIndex,
      title: body.title,
      description: body.description,
      category: body.category,
      typicalDurationDays: body.typicalDurationDays,
      validityDays: body.validityDays,
      dependsOn: body.dependsOn,
      mustCompleteBefore: body.mustCompleteBefore,
      officialUrl: body.officialUrl,
      cost: body.cost,
      costUsd: body.costUsd,
      currencyCode: body.currencyCode,
      originSide: body.originSide
    }
  })

  return step
})
