import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  const profile = await prisma.originProfile.update({
    where: { slug },
    include: { country: true },
    data: {
      summary: body.summary,
      taxResidencyRule: body.taxResidencyRule,
      exitTaxExists: body.exitTaxExists,
      exitTaxDetail: body.exitTaxDetail,
      daysToBreakResidency: body.daysToBreakResidency,
      zweitwohnsitzRule: body.zweitwohnsitzRule,
      zweitwohnsitzDetail: body.zweitwohnsitzDetail,
      unlimitedLiabilityTriggers: body.unlimitedLiabilityTriggers,
      taxExitNotes: body.taxExitNotes,
      taxExitSourceUrl: body.taxExitSourceUrl,
      taxExitVerifiedAt: body.taxExitVerifiedAt ? new Date(body.taxExitVerifiedAt) : null,
      deregisterResidence: body.deregisterResidence,
      deregisterBusiness: body.deregisterBusiness,
      timingRecommendation: body.timingRecommendation,
      deregSourceUrl: body.deregSourceUrl,
      deregVerifiedAt: body.deregVerifiedAt ? new Date(body.deregVerifiedAt) : null,
      bankAccountPostExit: body.bankAccountPostExit,
      bankAccountDetail: body.bankAccountDetail,
      pensionPortability: body.pensionPortability,
      abfertigungRules: body.abfertigungRules,
      socialInsuranceDetail: body.socialInsuranceDetail,
      financialSourceUrl: body.financialSourceUrl,
      financialVerifiedAt: body.financialVerifiedAt ? new Date(body.financialVerifiedAt) : null,
      policeClearanceIssuer: body.policeClearanceIssuer,
      policeClearanceWeeks: body.policeClearanceWeeks,
      policeClearanceValidityMonths: body.policeClearanceValidityMonths,
      policeClearanceUrl: body.policeClearanceUrl,
      documentsSourceUrl: body.documentsSourceUrl,
      documentsVerifiedAt: body.documentsVerifiedAt ? new Date(body.documentsVerifiedAt) : null,
      lastEditorialReview: new Date()
    }
  })

  return profile
})
