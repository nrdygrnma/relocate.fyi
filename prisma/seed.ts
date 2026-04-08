import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed Languages
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'German', code: 'de' },
    { name: 'French', code: 'fr' },
    { name: 'Spanish', code: 'es' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Italian', code: 'it' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Russian', code: 'ru' },
    { name: 'Thai', code: 'th' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Malay', code: 'ms' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Korean', code: 'ko' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Filipino', code: 'tl' },
    { name: 'Greek', code: 'el' },
    { name: 'Croatian', code: 'hr' }
  ]
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: { name: lang.name },
      create: lang
    })
  }

  // Seed Currencies
  const currencies = [
    { name: 'US Dollar', code: 'USD' },
    { name: 'Euro', code: 'EUR' },
    { name: 'British Pound', code: 'GBP' },
    { name: 'Swiss Franc', code: 'CHF' },
    { name: 'Japanese Yen', code: 'JPY' },
    { name: 'Australian Dollar', code: 'AUD' },
    { name: 'Canadian Dollar', code: 'CAD' },
    { name: 'Mauritian Rupee', code: 'MUR' },
    { name: 'Thai Baht', code: 'THB' },
    { name: 'Mexican Peso', code: 'MXN' },
    { name: 'UAE Dirham', code: 'AED' },
    { name: 'Singapore Dollar', code: 'SGD' },
    { name: 'Colombian Peso', code: 'COP' },
    { name: 'Panamanian Balboa', code: 'PAB' },
    { name: 'Vietnamese Dong', code: 'VND' },
    { name: 'Malaysian Ringgit', code: 'MYR' },
    { name: 'Indonesian Rupiah', code: 'IDR' },
    { name: 'Brazilian Real', code: 'BRL' },
    { name: 'Indian Rupee', code: 'INR' },
    { name: 'South African Rand', code: 'ZAR' },
    { name: 'Turkish Lira', code: 'TRY' },
    { name: 'Philippine Peso', code: 'PHP' },
    { name: 'New Zealand Dollar', code: 'NZD' },
    { name: 'Costa Rican Colon', code: 'CRC' },
    { name: 'Chinese Yuan', code: 'CNY' },
    { name: 'South Korean Won', code: 'KRW' }
  ]
  for (const curr of currencies) {
    await prisma.currency.upsert({
      where: { code: curr.code },
      update: { name: curr.name },
      create: curr
    })
  }

  // Seed Country References
  const countriesRef = [
    { name: 'Austria', isoCode: 'AT', currencyCode: 'EUR', languageCode: 'de', region: 'europe' },
    { name: 'Mauritius', isoCode: 'MU', currencyCode: 'MUR', languageCode: 'en', region: 'africa' },
    { name: 'Portugal', isoCode: 'PT', currencyCode: 'EUR', languageCode: 'pt', region: 'europe' },
    { name: 'Spain', isoCode: 'ES', currencyCode: 'EUR', languageCode: 'es', region: 'europe' },
    { name: 'Germany', isoCode: 'DE', currencyCode: 'EUR', languageCode: 'de', region: 'europe' },
    {
      name: 'United States',
      isoCode: 'US',
      currencyCode: 'USD',
      languageCode: 'en',
      region: 'americas'
    },
    {
      name: 'United Kingdom',
      isoCode: 'GB',
      currencyCode: 'GBP',
      languageCode: 'en',
      region: 'europe'
    },
    { name: 'France', isoCode: 'FR', currencyCode: 'EUR', languageCode: 'fr', region: 'europe' },
    { name: 'Italy', isoCode: 'IT', currencyCode: 'EUR', languageCode: 'it', region: 'europe' },
    {
      name: 'Switzerland',
      isoCode: 'CH',
      currencyCode: 'CHF',
      languageCode: 'de',
      region: 'europe'
    },
    { name: 'Panama', isoCode: 'PA', currencyCode: 'PAB', languageCode: 'es', region: 'americas' },
    {
      name: 'Colombia',
      isoCode: 'CO',
      currencyCode: 'COP',
      languageCode: 'es',
      region: 'americas'
    },
    { name: 'Mexico', isoCode: 'MX', currencyCode: 'MXN', languageCode: 'es', region: 'americas' },
    { name: 'Thailand', isoCode: 'TH', currencyCode: 'THB', languageCode: 'th', region: 'asia' },
    { name: 'Vietnam', isoCode: 'VN', currencyCode: 'VND', languageCode: 'vi', region: 'asia' },
    { name: 'China', isoCode: 'CN', currencyCode: 'CNY', languageCode: 'zh', region: 'asia' }, // CNY not in list, let's add or use USD? Added CNY below.
    {
      name: 'United Arab Emirates',
      isoCode: 'AE',
      currencyCode: 'AED',
      languageCode: 'ar',
      region: 'middle_east'
    },
    { name: 'Indonesia', isoCode: 'ID', currencyCode: 'IDR', languageCode: 'id', region: 'asia' },
    { name: 'Malaysia', isoCode: 'MY', currencyCode: 'MYR', languageCode: 'ms', region: 'asia' },
    { name: 'Singapore', isoCode: 'SG', currencyCode: 'SGD', languageCode: 'en', region: 'asia' },
    {
      name: 'Costa Rica',
      isoCode: 'CR',
      currencyCode: 'CRC',
      languageCode: 'es',
      region: 'americas'
    },
    { name: 'Philippines', isoCode: 'PH', currencyCode: 'PHP', languageCode: 'tl', region: 'asia' },
    { name: 'Brazil', isoCode: 'BR', currencyCode: 'BRL', languageCode: 'pt', region: 'americas' },
    { name: 'India', isoCode: 'IN', currencyCode: 'INR', languageCode: 'hi', region: 'asia' },
    {
      name: 'South Africa',
      isoCode: 'ZA',
      currencyCode: 'ZAR',
      languageCode: 'en',
      region: 'africa'
    },
    { name: 'Turkey', isoCode: 'TR', currencyCode: 'TRY', languageCode: 'tr', region: 'europe' },
    { name: 'Japan', isoCode: 'JP', currencyCode: 'JPY', languageCode: 'ja', region: 'asia' },
    { name: 'South Korea', isoCode: 'KR', currencyCode: 'KRW', languageCode: 'ko', region: 'asia' },
    {
      name: 'Australia',
      isoCode: 'AU',
      currencyCode: 'AUD',
      languageCode: 'en',
      region: 'oceania'
    },
    {
      name: 'New Zealand',
      isoCode: 'NZ',
      currencyCode: 'NZD',
      languageCode: 'en',
      region: 'oceania'
    },
    { name: 'Canada', isoCode: 'CA', currencyCode: 'CAD', languageCode: 'en', region: 'americas' },
    {
      name: 'Netherlands',
      isoCode: 'NL',
      currencyCode: 'EUR',
      languageCode: 'nl',
      region: 'europe'
    },
    { name: 'Ireland', isoCode: 'IE', currencyCode: 'EUR', languageCode: 'en', region: 'europe' },
    { name: 'Greece', isoCode: 'GR', currencyCode: 'EUR', languageCode: 'el', region: 'europe' },
    { name: 'Croatia', isoCode: 'HR', currencyCode: 'EUR', languageCode: 'hr', region: 'europe' },
    { name: 'Malta', isoCode: 'MT', currencyCode: 'EUR', languageCode: 'en', region: 'europe' },
    { name: 'Cyprus', isoCode: 'CY', currencyCode: 'EUR', languageCode: 'el', region: 'europe' }
  ]

  for (const c of countriesRef) {
    const currency = await prisma.currency.findUnique({ where: { code: c.currencyCode } })
    const language = await prisma.language.findUnique({ where: { code: c.languageCode } })

    await prisma.countryReference.upsert({
      where: { isoCode: c.isoCode },
      update: {
        name: c.name,
        region: c.region,
        currencyId: currency?.id,
        languagePrimaryId: language?.id
      },
      create: {
        name: c.name,
        isoCode: c.isoCode,
        region: c.region,
        currencyId: currency?.id,
        languagePrimaryId: language?.id
      }
    })
  }

  // Austria — origin country
  const austria = await prisma.country.upsert({
    where: { isoCode: 'AT' },
    update: {},
    create: {
      name: 'Austria',
      isoCode: 'AT',
      region: 'europe',
      currencyCode: 'EUR',
      languagePrimary: 'German',
      hasOriginProfile: true,
      hasDestinationProfile: false,
      published: true
    }
  })

  // Mauritius — destination country
  const mauritius = await prisma.country.upsert({
    where: { isoCode: 'MU' },
    update: {},
    create: {
      name: 'Mauritius',
      isoCode: 'MU',
      region: 'africa',
      currencyCode: 'MUR',
      languagePrimary: 'English',
      hasOriginProfile: false,
      hasDestinationProfile: true,
      published: true
    }
  })

  // Austria origin profile
  await prisma.originProfile.upsert({
    where: { countryId: austria.id },
    update: {},
    create: {
      countryId: austria.id,
      slug: 'austria',
      summary:
        "Austria has one of Europe's more complex tax exit frameworks. Breaking Austrian tax residency requires demonstrating that your Mittelpunkt des Lebens (centre of life) has genuinely shifted abroad.",
      taxResidencyRule:
        'Austria taxes based on domicile (Wohnsitz) or habitual abode (gewöhnlicher Aufenthalt). Having a domicile — defined as a dwelling kept for use at any time — triggers unlimited tax liability regardless of time spent abroad.',
      exitTaxExists: false,
      daysToBreakResidency: 183,
      zweitwohnsitzRule: true,
      zweitwohnsitzDetail:
        'If you maintain any dwelling in Austria that you can use at any time — even a room in a family home — this can constitute a domicile and maintain Austrian unlimited tax liability.',
      unlimitedLiabilityTriggers:
        'Unlimited tax liability persists if: (1) you maintain a domicile in Austria, (2) your habitual abode remains in Austria 183+ days, or (3) you are an Austrian civil servant.',
      taxExitNotes:
        'Consult a Steuerberater before departing. Ensure your new country confirms your tax residency in writing before the Austrian tax year ends.',
      taxExitVerifiedAt: new Date('2025-11-01'),
      taxExitSourceUrl: 'https://www.bmf.gv.at',
      deregisterResidence:
        'File a Meldezettel Abmeldung at your local Meldeamt. You receive a Abmeldebestätigung which is required by banks and authorities.',
      deregisterBusiness:
        'For Neuer Selbständiger: submit Aufgabe der Tätigkeit to the SVS. For Gewerbeschein holders: surrender the licence at the Gewerbebehörde.',
      timingRecommendation:
        'Deregister 1–2 weeks before departure. Do not deregister too early — you may still need Austrian residence for pending applications.',
      deregVerifiedAt: new Date('2025-11-01'),
      deregSourceUrl: 'https://www.oesterreich.gv.at',
      bankAccountPostExit: 'varies_by_bank',
      bankAccountDetail:
        'Most Austrian banks allow non-residents to maintain accounts but may restrict services. N26 typically has no restrictions on non-resident use as long as you maintain a valid EU address.',
      pensionPortability:
        'Austrian state pension (ASVG) entitlements remain intact when you leave. You can claim your pension from abroad.',
      abfertigungRules:
        'Abfertigung Neu: if you are an employee, BV-Kasse contributions remain yours but cannot be withdrawn simply by leaving Austria. Withdrawal is only possible at retirement age or under specific hardship conditions.',
      socialInsuranceDetail:
        'Outstanding SVS quarterly payments must be settled before departure. The final Einkommensteuerbescheid for your last year will arrive the following year — ensure Finanzamt has a forwarding address.',
      financialVerifiedAt: new Date('2025-11-01'),
      financialSourceUrl: 'https://www.svs.at',
      policeClearanceIssuer: 'Bundeskriminalamt Wien',
      policeClearanceWeeks: 3,
      policeClearanceValidityMonths: 6,
      policeClearanceUrl: 'https://www.bmi.gv.at/503/Strafregisterbescheinigungen/',
      otherExitDocuments: JSON.stringify([
        {
          name: 'Birth certificate with apostille',
          issuer: 'Standesamt / Landesgericht',
          url: 'https://www.justiz.gv.at'
        },
        {
          name: 'Marriage certificate with apostille',
          issuer: 'Standesamt / Landesgericht',
          url: 'https://www.justiz.gv.at'
        },
        {
          name: 'Proof of income / pension statements',
          issuer: 'Your bank / pension authority',
          url: null
        }
      ]),
      documentsVerifiedAt: new Date('2025-11-01'),
      documentsSourceUrl: 'https://www.bmi.gv.at',
      lastEditorialReview: new Date('2025-11-01')
    }
  })

  // Mauritius destination profile
  const muProfile = await prisma.destinationProfile.upsert({
    where: { countryId: mauritius.id },
    update: {},
    create: {
      countryId: mauritius.id,
      slug: 'mauritius',
      summary:
        'Mauritius offers a stable English-speaking environment with a remittance-based tax system, no capital gains tax, and a well-developed financial sector.',
      taxBasis: 'remittance',
      taxRemittanceDetail:
        'Mauritius taxes only income remitted to Mauritius. Foreign-sourced income that remains offshore is not taxed.',
      incomeTaxRateMin: 0,
      incomeTaxRateMax: 20,
      capitalGainsTax: false,
      wealthTax: false,
      dtaCountries: JSON.stringify(['ZA', 'IN', 'FR', 'GB', 'DE', 'SE', 'LU', 'SG', 'HK', 'UAE']),
      tieaCountries: JSON.stringify(['AT']),
      taxNotes:
        'Austria does not have a DTA with Mauritius — only a TIEA exists. Austrian-source income may be taxed in both jurisdictions without credit relief.',
      taxVerifiedAt: new Date('2025-10-01'),
      taxSourceUrl: 'https://www.mra.mu',
      neobankAccepted: 'partial',
      neobankDetail:
        'Traditional Mauritian banks require a branch-issued reference letter which neobanks like N26 cannot provide. AfrAsia and Absa have shown more flexibility with 6+ months of transaction history.',
      accountBeforeArrival: false,
      permitRequiredForBanking: true,
      minDepositRequired: true,
      minDepositAmountUsd: 10000,
      recommendedBanks: JSON.stringify([
        {
          name: 'MCB',
          type: 'traditional',
          expatFriendly: true,
          notes: 'Largest bank. Good expat track record.'
        },
        {
          name: 'AfrAsia Bank',
          type: 'private',
          expatFriendly: true,
          notes: 'More flexible with non-traditional income documentation.'
        },
        {
          name: 'Absa Mauritius',
          type: 'traditional',
          expatFriendly: true,
          notes: 'Good for those with existing Absa relationships.'
        },
        {
          name: 'SBM',
          type: 'traditional',
          expatFriendly: false,
          notes: 'Government-owned, more bureaucratic.'
        }
      ]),
      bankingNotes:
        'Banking must happen in-person. All banks require the EDB residence permit before account opening.',
      bankingVerifiedAt: new Date('2025-10-01'),
      bankingSourceUrl: 'https://www.mcb.mu',
      publicHealthcareAccess: 'limited',
      publicHealthcareDetail:
        'Permit holders have access to public hospitals as paying patients at subsidised rates. Specialist care is best handled at private facilities.',
      privateInsuranceRequired: true,
      avgPrivateInsuranceUsdPa: 1800,
      healthcareQualityNotes:
        'Apollo Bramwell Hospital and Clinique Darné are the two main private hospitals with acceptable international standards.',
      healthcareVerifiedAt: new Date('2025-10-01'),
      healthcareSourceUrl: 'https://www.apollobramwell.com',
      costTier: 'medium',
      monthlyBudgetSingleUsd: 2200,
      monthlyBudgetCoupleUsd: 3000,
      rent1bedCityUsd: 900,
      rent1bedOutsideUsd: 650,
      costNotes:
        'Significant expat premium on housing and consumer goods. Most food is imported. A car is essentially mandatory.',
      costVerifiedAt: new Date('2025-10-01'),
      costSourceUrl: 'https://www.gov.mu',
      policeClearanceRequired: true,
      apostilleRequired: true,
      translationRequired: false,
      inPersonRequired: true,
      inPersonDetail:
        'Minimum 2–3 week stay required for EDB appointment and bank account opening.',
      frictionNotes:
        'Police clearance must be under 6 months old at EDB submission. Submit NELS Stage 1 before July 2026 to avoid potential policy changes.',
      frictionVerifiedAt: new Date('2025-10-01'),
      frictionSourceUrl: 'https://www.edbmauritius.org',
      lastEditorialReview: new Date('2025-10-01')
    }
  })

  // Mauritius — Retired Non-Citizen Pathway
  const pathway = await prisma.pathway.upsert({
    where: { slug: 'mauritius-retired-non-citizen' },
    update: {},
    create: {
      destinationProfileId: muProfile.id,
      name: 'Retired Non-Citizen Permit',
      slug: 'mauritius-retired-non-citizen',
      officialName: 'Retired Non-Citizen Residence Permit (+50)',
      summary:
        'The primary pathway for individuals aged 50+ who wish to retire in Mauritius. Requires proof of regular foreign-sourced income transferred to Mauritius.',
      pathwayType: 'retirement',
      published: true,
      durationYears: 10,
      renewable: true,
      renewalDetail:
        'Renewable for further 10-year periods provided income conditions continue to be met.',
      leadsToPr: false,
      dependentsAllowed: true,
      dependentTypes: JSON.stringify([
        'spouse',
        'dependent_children_under_24',
        'dependent_parents'
      ]),
      workAllowed: 'remote_only',
      stayRequirementDaysPA: 183,
      propertyPurchaseRequired: false,
      applicationStages: JSON.stringify([
        'Stage 1: NELS online portal — submit documents and pay fee',
        'Stage 2: EDB in-person appointment in Port Louis',
        'Stage 3: Permit issuance and collection'
      ]),
      processingWeeksMin: 8,
      processingWeeksMax: 16,
      inPersonRequired: true,
      governmentFeeUsd: 375,
      processNotes:
        'The NELS portal is the entry point. The EDB appointment is typically scheduled 2–4 weeks after a complete Stage 1 submission.',
      lastVerifiedAt: new Date('2025-10-01'),
      sourceUrl: 'https://www.edbmauritius.org/residence-permit/retired-non-citizen/'
    }
  })

  // Eligibility rules
  await prisma.eligibilityRule.createMany({
    data: [
      {
        pathwayId: pathway.id,
        ruleType: 'age_min',
        operator: 'gte',
        valueInt: 50,
        hardRequirement: true,
        displayLabel: 'Must be aged 50 or over',
        notes: 'Age verified against passport at EDB appointment.'
      },
      {
        pathwayId: pathway.id,
        ruleType: 'income_min',
        operator: 'gte',
        valueInt: 18000,
        hardRequirement: true,
        displayLabel: 'Minimum USD 1,500/month transferred to Mauritius',
        notes: 'Pension, investment income, and remote work income all qualify.'
      },
      {
        pathwayId: pathway.id,
        ruleType: 'health_insurance',
        operator: 'exists',
        valueString: 'required',
        hardRequirement: true,
        displayLabel: 'Valid private health insurance covering Mauritius required',
        notes: 'Must be in place before or at time of permit application.'
      },
      {
        pathwayId: pathway.id,
        ruleType: 'other',
        operator: 'exists',
        valueString: 'clean_criminal_record',
        hardRequirement: true,
        displayLabel: 'Clean criminal record — police clearance required',
        notes: 'Must be issued within 6 months of EDB submission. Apostille required.'
      }
    ]
  })

  // Steps
  await prisma.step.deleteMany({}) // Clean up steps first as createMany might fail on repeat
  await prisma.step.createMany({
    data: [
      {
        pathwayId: pathway.id,
        orderIndex: 1,
        title: 'Request Austrian police clearance',
        description:
          'Apply at Bundeskriminalamt Wien. Must be under 6 months old at EDB submission. Allow 3–4 weeks.',
        category: 'document',
        typicalDurationDays: 21,
        validityDays: 180,
        officialUrl: 'https://www.bmi.gv.at/503/Strafregisterbescheinigungen/',
        costUsd: 25,
        originSide: true
      },
      {
        pathwayId: pathway.id,
        orderIndex: 2,
        title: 'Obtain apostille for Austrian documents',
        description:
          'All Austrian documents submitted to EDB require apostille from the competent Landesgericht.',
        category: 'document',
        typicalDurationDays: 14,
        officialUrl: 'https://www.justiz.gv.at',
        costUsd: 30,
        originSide: true
      },
      {
        pathwayId: pathway.id,
        orderIndex: 3,
        title: 'Gather proof of income documentation',
        description:
          'Last 3 months bank statements, pension award letter if applicable, and income source confirmation. Translate to English if in German.',
        category: 'document',
        typicalDurationDays: 14,
        validityDays: 90,
        costUsd: 150,
        originSide: true
      },
      {
        pathwayId: pathway.id,
        orderIndex: 4,
        title: 'Arrange private health insurance covering Mauritius',
        description:
          'Obtain a policy covering you in Mauritius for the permit duration. Cigna Global, AXA IPPHO, and Allianz Care are options.',
        category: 'legal',
        typicalDurationDays: 14,
        costUsd: 1800,
        originSide: true
      },
      {
        pathwayId: pathway.id,
        orderIndex: 5,
        title: 'Create NELS portal account',
        description:
          'Register at https://nels.mu under Residence Permit — Retired Non-Citizen category.',
        category: 'submission',
        typicalDurationDays: 1,
        officialUrl: 'https://nels.mu',
        originSide: false
      },
      {
        pathwayId: pathway.id,
        orderIndex: 6,
        title: 'Complete NELS Stage 1 online submission',
        description:
          'Upload all documents and pay the application fee. Submit before July 2026 to avoid potential policy changes.',
        category: 'submission',
        typicalDurationDays: 3,
        officialUrl: 'https://nels.mu',
        costUsd: 375,
        originSide: false
      },
      {
        pathwayId: pathway.id,
        orderIndex: 7,
        title: 'Travel to Mauritius for EDB appointment',
        description:
          'Book flights and accommodation for minimum 2–3 weeks. Bring ALL original documents.',
        category: 'travel',
        typicalDurationDays: 21,
        costUsd: 3500,
        originSide: false
      },
      {
        pathwayId: pathway.id,
        orderIndex: 8,
        title: 'Attend EDB in-person appointment',
        description:
          'Attend at EDB office in Port Louis. Biometrics taken. Bring originals and copies. Allow 30–90 minutes.',
        category: 'appointment',
        typicalDurationDays: 1,
        officialUrl: 'https://www.edbmauritius.org',
        originSide: false
      },
      {
        pathwayId: pathway.id,
        orderIndex: 9,
        title: 'Open Mauritian bank account',
        description:
          'Visit MCB, AfrAsia, or Absa with passport, permit acknowledgement, proof of income, and 6 months home-country statements. Allow 1–3 weeks.',
        category: 'banking',
        typicalDurationDays: 14,
        originSide: false
      },
      {
        pathwayId: pathway.id,
        orderIndex: 10,
        title: 'Collect EDB permit card',
        description:
          'Issued 6–14 weeks after appointment. Collect in person or via authorised representative. First income transfer of USD 1,500+ should follow immediately.',
        category: 'document',
        typicalDurationDays: 1,
        officialUrl: 'https://www.edbmauritius.org',
        originSide: false
      }
    ]
  })

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(() => prisma.$disconnect())
