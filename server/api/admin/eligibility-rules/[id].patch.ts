import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing rule ID'
    })
  }

  const rule = await prisma.eligibilityRule.update({
    where: { id },
    data: {
      ruleType: body.ruleType,
      operator: body.operator,
      valueInt: body.valueInt,
      valueString: body.valueString,
      valueList: body.valueList,
      perDependent: body.perDependent,
      dependentIncrementUsd: body.dependentIncrementUsd,
      hardRequirement: body.hardRequirement,
      displayLabel: body.displayLabel,
      notes: body.notes
    }
  })

  return rule
})
