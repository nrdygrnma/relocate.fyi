import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class AdminPage extends BasePage {
  readonly pageHeading: Locator
  readonly countryCards: Locator
  readonly addCountryButton: Locator
  readonly nameInput: Locator
  readonly isoInput: Locator
  readonly regionSelect: Locator
  readonly submitButton: Locator
  readonly destinationSwitch: Locator
  readonly originSwitch: Locator
  readonly currencyInput: Locator
  readonly languageInput: Locator

  constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.countryCards = page.locator('.cursor-pointer')
    this.addCountryButton = page.getByTestId('add-country')
    this.nameInput = page.getByTestId('country-search-input')
    this.isoInput = page.getByTestId('iso-input')
    this.currencyInput = page.getByRole('button', { name: /select currency/i })
    this.languageInput = page.getByRole('button', { name: /select language/i })
    this.regionSelect = page.getByRole('combobox')
    this.submitButton = page.locator('button[type="submit"]')
    this.destinationSwitch = page.locator('button[role="switch"]').first()
    this.originSwitch = page.locator('button[role="switch"]').last()
  }

  async navigate() {
    await this.navigateTo('/admin/countries')
  }

  getCountryCard(countryName: string) {
    return this.page.locator('.cursor-pointer', { hasText: countryName })
  }

  getDeleteButton(countryName: string) {
    return this.getCountryCard(countryName).locator('.delete-button')
  }

  getEditButton(countryName: string) {
    return this.getCountryCard(countryName).getByTestId('edit-country')
  }

  getConfirmDeleteButton() {
    return this.page.getByRole('button', { name: 'Delete' })
  }
}
