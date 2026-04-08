import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class DestinationProfilePage extends BasePage {
  readonly pageHeading: Locator
  readonly sections: {
    healthcare: Locator
    cost: Locator
    banking: Locator
    tax: Locator
    friction: Locator
  }

  constructor(page: Page) {
    super(page)
    this.pageHeading = page.locator('h1')
    this.sections = {
      healthcare: page.getByRole('heading', { name: 'Healthcare' }),
      cost: page.getByRole('heading', { name: 'Cost of living' }),
      banking: page.getByRole('heading', { name: 'Banking' }),
      tax: page.getByRole('heading', { name: 'Tax structure' }),
      friction: page.getByRole('heading', { name: 'Practical requirements' })
    }
  }

  async navigate(slug: string) {
    await this.navigateTo(`/destination/${slug}`)
  }

  getPathwayCard(name: string) {
    return this.page
      .locator('div', { hasText: name })
      .filter({ has: this.page.getByRole('heading', { level: 3, name: name }) })
      .first()
  }
}
