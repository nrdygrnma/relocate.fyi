import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  readonly heroHeading: Locator
  readonly destinationSection: Locator
  readonly originSection: Locator

  constructor(page: Page) {
    super(page)
    this.heroHeading = page.getByRole('heading', { name: 'Find your relocation pathway' })
    this.destinationSection = page.getByText('Destination countries')
    this.originSection = page.getByText('Origin countries')
  }

  async navigate() {
    await this.navigateTo('/')
  }

  getCountryCard(name: string) {
    return this.page.locator('[data-slot="body"]', { hasText: name }).first()
  }

  async clickCountry(name: string) {
    await this.getCountryCard(name).click()
  }
}
