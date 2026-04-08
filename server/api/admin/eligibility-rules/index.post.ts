import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.pathwayId || !body.ruleType || !body.displayLabel) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  const rule = await prisma.eligibilityRule.create({
    data: {
      pathwayId: body.pathwayId,
      ruleType: body.ruleType,
      operator: body.operator || 'eq',
      valueInt: body.valueInt,
      valueString: body.valueString,
      valueList: body.valueList,
      perDependent: body.perDependent || false,
      dependentIncrementUsd: body.dependentIncrementUsd,
      hardRequirement: body.hardRequirement !== undefined ? body.hardRequirement : true,
      displayLabel: body.displayLabel,
      notes: body.notes
    }
  })

  return rule
})
