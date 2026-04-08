import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class PathwayFinderPage extends BasePage {
  readonly heading: Locator
  readonly stepCounter: Locator
  readonly continueButton: Locator
  readonly findPathwaysButton: Locator
  readonly nationalitySelect: Locator
  readonly ageInput: Locator
  readonly incomeInput: Locator
  readonly employmentStatus: {
    employed: Locator
    selfEmployed: Locator
    retired: Locator
    student: Locator
    unemployed: Locator
  }
  readonly healthInsurance: {
    yes: Locator
    no: Locator
  }

  constructor(page: Page) {
    super(page)
    this.heading = page.getByRole('heading', { name: 'Find your pathway' })
    this.stepCounter = page.getByText(/Step \d of 6/)
    this.continueButton = page.getByRole('button', { name: 'Continue' })
    this.findPathwaysButton = page.getByRole('button', { name: 'Find pathways' })
    this.nationalitySelect = page.locator('[role="combobox"]')
    this.ageInput = page.getByPlaceholder('e.g. 52')
    this.incomeInput = page.getByPlaceholder('e.g. 2500')
    this.employmentStatus = {
      employed: page.getByText('Employed', { exact: true }),
      selfEmployed: page.getByText('Self-Employed', { exact: true }),
      retired: page.getByText('Retired', { exact: true }),
      student: page.getByText('Student', { exact: true }),
      unemployed: page.getByText('Unemployed', { exact: true })
    }
    this.healthInsurance = {
      yes: page.getByText('I have private health insurance'),
      no: page.getByText('I do not have private health insurance')
    }
  }

  async navigate() {
    await this.navigateTo('/pathway-finder')
  }

  async selectNationality(country: string) {
    await this.nationalitySelect.click()
    await this.page.getByRole('option', { name: country }).click()
  }

  async fillAge(age: string) {
    await this.ageInput.fill(age)
  }

  async fillIncome(income: string) {
    await this.incomeInput.fill(income)
  }

  async clickContinue() {
    await this.continueButton.click()
  }

  async clickFindPathways() {
    await this.findPathwaysButton.click()
  }
}
