import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class OriginProfilePage extends BasePage {
  readonly pageHeading: Locator
  readonly sections: {
    taxExit: Locator
    deregistration: Locator
    financial: Locator
    documents: Locator
  }

  constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.sections = {
      taxExit: page.getByRole('heading', { name: 'Tax liability exit' }),
      deregistration: page.getByRole('heading', { name: 'Deregistration' }),
      financial: page.getByRole('heading', { name: 'Financial continuity' }),
      documents: page.getByRole('heading', { name: 'Documents needed to exit' })
    }
  }

  async navigate(slug: string) {
    await this.navigateTo(`/origin/${slug}`)
  }
}
