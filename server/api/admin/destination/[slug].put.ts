import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  const profile = await prisma.destinationProfile.update({
    where: { slug },
    include: { country: true },
    data: {
      summary: body.summary,
      taxBasis: body.taxBasis,
      taxRemittanceDetail: body.taxRemittanceDetail,
      incomeTaxRateMin: body.incomeTaxRateMin,
      incomeTaxRateMax: body.incomeTaxRateMax,
      capitalGainsTax: body.capitalGainsTax,
      capitalGainsDetail: body.capitalGainsDetail,
      wealthTax: body.wealthTax,
      taxNotes: body.taxNotes,
      taxSourceUrl: body.taxSourceUrl,
      taxVerifiedAt: body.taxVerifiedAt ? new Date(body.taxVerifiedAt) : null,
      neobankAccepted: body.neobankAccepted,
      neobankDetail: body.neobankDetail,
      accountBeforeArrival: body.accountBeforeArrival,
      permitRequiredForBanking: body.permitRequiredForBanking,
      minDepositRequired: body.minDepositRequired,
      minDepositAmountUsd: body.minDepositAmountUsd,
      bankingNotes: body.bankingNotes,
      bankingSourceUrl: body.bankingSourceUrl,
      bankingVerifiedAt: body.bankingVerifiedAt ? new Date(body.bankingVerifiedAt) : null,
      publicHealthcareAccess: body.publicHealthcareAccess,
      publicHealthcareDetail: body.publicHealthcareDetail,
      privateInsuranceRequired: body.privateInsuranceRequired,
      avgPrivateInsuranceUsdPa: body.avgPrivateInsuranceUsdPa,
      healthcareQualityNotes: body.healthcareQualityNotes,
      healthcareSourceUrl: body.healthcareSourceUrl,
      healthcareVerifiedAt: body.healthcareVerifiedAt ? new Date(body.healthcareVerifiedAt) : null,
      costTier: body.costTier,
      monthlyBudgetSingleUsd: body.monthlyBudgetSingleUsd,
      monthlyBudgetCoupleUsd: body.monthlyBudgetCoupleUsd,
      rent1bedCityUsd: body.rent1bedCityUsd,
      rent1bedOutsideUsd: body.rent1bedOutsideUsd,
      costNotes: body.costNotes,
      costSourceUrl: body.costSourceUrl,
      costVerifiedAt: body.costVerifiedAt ? new Date(body.costVerifiedAt) : null,
      policeClearanceRequired: body.policeClearanceRequired,
      apostilleRequired: body.apostilleRequired,
      translationRequired: body.translationRequired,
      inPersonRequired: body.inPersonRequired,
      inPersonDetail: body.inPersonDetail,
      frictionNotes: body.frictionNotes,
      frictionSourceUrl: body.frictionSourceUrl,
      frictionVerifiedAt: body.frictionVerifiedAt ? new Date(body.frictionVerifiedAt) : null,
      lastEditorialReview: new Date()
    }
  })

  return profile
})
