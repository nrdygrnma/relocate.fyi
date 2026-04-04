export interface Country {
  id: string
  name: string
  isoCode: string
  region: string
  currencyCode: string | null
  languagePrimary: string | null
  hasDestinationProfile: boolean
  hasOriginProfile: boolean
  published: boolean
  createdAt: string
  updatedAt: string
  destinationProfile?: { slug: string } | null
  originProfile?: { slug: string } | null
}

export interface EligibilityRule {
  id: string
  pathwayId: string
  ruleType: string
  operator: string
  valueInt: number | null
  valueString: string | null
  valueList: string | null
  perDependent: boolean
  dependentIncrementUsd: number | null
  hardRequirement: boolean
  displayLabel: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Step {
  id: string
  pathwayId: string
  orderIndex: number
  title: string
  description: string | null
  category: string
  typicalDurationDays: number | null
  validityDays: number | null
  dependsOn: string | null
  mustCompleteBefore: string | null
  officialUrl: string | null
  costUsd: number | null
  originSide: boolean
  createdAt: string
  updatedAt: string
}

export interface Pathway {
  id: string
  destinationProfileId: string
  name: string
  slug: string
  officialName: string | null
  summary: string | null
  pathwayType: string
  published: boolean
  durationYears: number | null
  renewable: boolean
  renewalDetail: string | null
  leadsToPr: boolean
  prTimelineYears: number | null
  dependentsAllowed: boolean
  dependentTypes: string | null
  workAllowed: string
  stayRequirementDaysPA: number | null
  propertyPurchaseRequired: boolean
  propertyMinValueUsd: number | null
  applicationStages: string | null
  processingWeeksMin: number | null
  processingWeeksMax: number | null
  inPersonRequired: boolean
  governmentFeeUsd: number | null
  processNotes: string | null
  lastVerifiedAt: string | null
  sourceUrl: string | null
  createdAt: string
  updatedAt: string
  eligibilityRules: EligibilityRule[]
  steps: Step[]
}

export interface DestinationProfile {
  id: string
  countryId: string
  slug: string
  summary: string | null
  country: Country
  taxBasis: string | null
  taxRemittanceDetail: string | null
  incomeTaxRateMin: number | null
  incomeTaxRateMax: number | null
  capitalGainsTax: boolean
  capitalGainsDetail: string | null
  wealthTax: boolean
  dtaCountries: string | null
  tieaCountries: string | null
  taxNotes: string | null
  taxVerifiedAt: string | null
  taxSourceUrl: string | null
  neobankAccepted: string | null
  neobankDetail: string | null
  accountBeforeArrival: boolean
  permitRequiredForBanking: boolean
  minDepositRequired: boolean
  minDepositAmountUsd: number | null
  recommendedBanks: string | null
  bankingNotes: string | null
  bankingVerifiedAt: string | null
  bankingSourceUrl: string | null
  publicHealthcareAccess: string | null
  publicHealthcareDetail: string | null
  privateInsuranceRequired: boolean
  avgPrivateInsuranceUsdPa: number | null
  healthcareQualityNotes: string | null
  healthcareVerifiedAt: string | null
  healthcareSourceUrl: string | null
  costTier: string | null
  monthlyBudgetSingleUsd: number | null
  monthlyBudgetCoupleUsd: number | null
  rent1bedCityUsd: number | null
  rent1bedOutsideUsd: number | null
  costNotes: string | null
  costVerifiedAt: string | null
  costSourceUrl: string | null
  policeClearanceRequired: boolean
  apostilleRequired: boolean
  translationRequired: boolean
  translationLanguages: string | null
  inPersonRequired: boolean
  inPersonDetail: string | null
  frictionNotes: string | null
  frictionVerifiedAt: string | null
  frictionSourceUrl: string | null
  lastEditorialReview: string | null
  createdAt: string
  updatedAt: string
  pathways: Pathway[]
}

export interface OriginProfile {
  id: string
  countryId: string
  slug: string
  summary: string | null
  country: Country
  taxResidencyRule: string | null
  exitTaxExists: boolean
  exitTaxDetail: string | null
  daysToBreakResidency: number | null
  zweitwohnsitzRule: boolean
  zweitwohnsitzDetail: string | null
  unlimitedLiabilityTriggers: string | null
  taxExitNotes: string | null
  taxExitVerifiedAt: string | null
  taxExitSourceUrl: string | null
  deregisterResidence: string | null
  deregisterBusiness: string | null
  timingRecommendation: string | null
  deregVerifiedAt: string | null
  deregSourceUrl: string | null
  bankAccountPostExit: string | null
  bankAccountDetail: string | null
  pensionPortability: string | null
  abfertigungRules: string | null
  socialInsuranceDetail: string | null
  financialVerifiedAt: string | null
  financialSourceUrl: string | null
  policeClearanceIssuer: string | null
  policeClearanceWeeks: number | null
  policeClearanceValidityMonths: number | null
  policeClearanceUrl: string | null
  otherExitDocuments: string | null
  documentsVerifiedAt: string | null
  documentsSourceUrl: string | null
  lastEditorialReview: string | null
  createdAt: string
  updatedAt: string
}

export interface ProfileResponse {
  type: 'destination' | 'origin'
  data: DestinationProfile | OriginProfile
}

export interface Pathway {
  id: string
  destinationProfileId: string
  name: string
  slug: string
  officialName: string | null
  summary: string | null
  pathwayType: string
  published: boolean
  durationYears: number | null
  renewable: boolean
  renewalDetail: string | null
  leadsToPr: boolean
  prTimelineYears: number | null
  dependentsAllowed: boolean
  dependentTypes: string | null
  workAllowed: string
  stayRequirementDaysPA: number | null
  propertyPurchaseRequired: boolean
  propertyMinValueUsd: number | null
  applicationStages: string | null
  processingWeeksMin: number | null
  processingWeeksMax: number | null
  inPersonRequired: boolean
  governmentFeeUsd: number | null
  processNotes: string | null
  lastVerifiedAt: string | null
  sourceUrl: string | null
  createdAt: string
  updatedAt: string
  eligibilityRules: EligibilityRule[]
  steps: Step[]
  destinationProfile?: {
    slug: string
    country: {
      id: string
      name: string
      isoCode: string
    }
  }
}
