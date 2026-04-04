-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "currencyCode" TEXT,
    "languagePrimary" TEXT,
    "hasDestinationProfile" BOOLEAN NOT NULL DEFAULT false,
    "hasOriginProfile" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DestinationProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "taxBasis" TEXT,
    "taxRemittanceDetail" TEXT,
    "incomeTaxRateMin" INTEGER,
    "incomeTaxRateMax" INTEGER,
    "capitalGainsTax" BOOLEAN NOT NULL DEFAULT false,
    "capitalGainsDetail" TEXT,
    "wealthTax" BOOLEAN NOT NULL DEFAULT false,
    "dtaCountries" TEXT,
    "tieaCountries" TEXT,
    "taxNotes" TEXT,
    "taxVerifiedAt" DATETIME,
    "taxSourceUrl" TEXT,
    "neobankAccepted" TEXT,
    "neobankDetail" TEXT,
    "accountBeforeArrival" BOOLEAN NOT NULL DEFAULT false,
    "permitRequiredForBanking" BOOLEAN NOT NULL DEFAULT false,
    "minDepositRequired" BOOLEAN NOT NULL DEFAULT false,
    "minDepositAmountUsd" INTEGER,
    "recommendedBanks" TEXT,
    "bankingNotes" TEXT,
    "bankingVerifiedAt" DATETIME,
    "bankingSourceUrl" TEXT,
    "publicHealthcareAccess" TEXT,
    "publicHealthcareDetail" TEXT,
    "privateInsuranceRequired" BOOLEAN NOT NULL DEFAULT false,
    "avgPrivateInsuranceUsdPa" INTEGER,
    "healthcareQualityNotes" TEXT,
    "healthcareVerifiedAt" DATETIME,
    "healthcareSourceUrl" TEXT,
    "costTier" TEXT,
    "monthlyBudgetSingleUsd" INTEGER,
    "monthlyBudgetCoupleUsd" INTEGER,
    "rent1bedCityUsd" INTEGER,
    "rent1bedOutsideUsd" INTEGER,
    "costNotes" TEXT,
    "costVerifiedAt" DATETIME,
    "costSourceUrl" TEXT,
    "policeClearanceRequired" BOOLEAN NOT NULL DEFAULT false,
    "apostilleRequired" BOOLEAN NOT NULL DEFAULT false,
    "translationRequired" BOOLEAN NOT NULL DEFAULT false,
    "translationLanguages" TEXT,
    "inPersonRequired" BOOLEAN NOT NULL DEFAULT false,
    "inPersonDetail" TEXT,
    "frictionNotes" TEXT,
    "frictionVerifiedAt" DATETIME,
    "frictionSourceUrl" TEXT,
    "lastEditorialReview" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DestinationProfile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OriginProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "taxResidencyRule" TEXT,
    "exitTaxExists" BOOLEAN NOT NULL DEFAULT false,
    "exitTaxDetail" TEXT,
    "daysToBreakResidency" INTEGER,
    "zweitwohnsitzRule" BOOLEAN NOT NULL DEFAULT false,
    "zweitwohnsitzDetail" TEXT,
    "unlimitedLiabilityTriggers" TEXT,
    "taxExitNotes" TEXT,
    "taxExitVerifiedAt" DATETIME,
    "taxExitSourceUrl" TEXT,
    "deregisterResidence" TEXT,
    "deregisterBusiness" TEXT,
    "timingRecommendation" TEXT,
    "deregVerifiedAt" DATETIME,
    "deregSourceUrl" TEXT,
    "bankAccountPostExit" TEXT,
    "bankAccountDetail" TEXT,
    "pensionPortability" TEXT,
    "abfertigungRules" TEXT,
    "socialInsuranceDetail" TEXT,
    "financialVerifiedAt" DATETIME,
    "financialSourceUrl" TEXT,
    "policeClearanceIssuer" TEXT,
    "policeClearanceWeeks" INTEGER,
    "policeClearanceValidityMonths" INTEGER,
    "policeClearanceUrl" TEXT,
    "otherExitDocuments" TEXT,
    "documentsVerifiedAt" DATETIME,
    "documentsSourceUrl" TEXT,
    "lastEditorialReview" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OriginProfile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pathway" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "officialName" TEXT,
    "summary" TEXT,
    "pathwayType" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "durationYears" INTEGER,
    "renewable" BOOLEAN NOT NULL DEFAULT false,
    "renewalDetail" TEXT,
    "leadsToPr" BOOLEAN NOT NULL DEFAULT false,
    "prTimelineYears" INTEGER,
    "dependentsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "dependentTypes" TEXT,
    "workAllowed" TEXT NOT NULL DEFAULT 'no',
    "stayRequirementDaysPA" INTEGER,
    "propertyPurchaseRequired" BOOLEAN NOT NULL DEFAULT false,
    "propertyMinValueUsd" INTEGER,
    "applicationStages" TEXT,
    "processingWeeksMin" INTEGER,
    "processingWeeksMax" INTEGER,
    "inPersonRequired" BOOLEAN NOT NULL DEFAULT false,
    "governmentFeeUsd" INTEGER,
    "processNotes" TEXT,
    "lastVerifiedAt" DATETIME,
    "sourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pathway_destinationProfileId_fkey" FOREIGN KEY ("destinationProfileId") REFERENCES "DestinationProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "typicalDurationDays" INTEGER,
    "validityDays" INTEGER,
    "dependsOn" TEXT,
    "mustCompleteBefore" TEXT,
    "officialUrl" TEXT,
    "costUsd" INTEGER,
    "originSide" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Step_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EligibilityRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "valueInt" INTEGER,
    "valueString" TEXT,
    "valueList" TEXT,
    "perDependent" BOOLEAN NOT NULL DEFAULT false,
    "dependentIncrementUsd" INTEGER,
    "hardRequirement" BOOLEAN NOT NULL DEFAULT true,
    "displayLabel" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EligibilityRule_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationProfile_countryId_key" ON "DestinationProfile"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationProfile_slug_key" ON "DestinationProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OriginProfile_countryId_key" ON "OriginProfile"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "OriginProfile_slug_key" ON "OriginProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pathway_slug_key" ON "Pathway"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Step_pathwayId_orderIndex_key" ON "Step"("pathwayId", "orderIndex");
