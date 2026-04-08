import { test as baseTest } from '@playwright/test'
import { HomePage } from './frontend/po/HomePage'
import { DestinationProfilePage } from './frontend/po/DestinationProfilePage'
import { OriginProfilePage } from './frontend/po/OriginProfilePage'
import { PathwayFinderPage } from './frontend/po/PathwayFinderPage'
import { AdminPage } from './frontend/po/AdminPage'

type Fixtures = {
  homePage: HomePage
  destinationProfilePage: DestinationProfilePage
  originProfilePage: OriginProfilePage
  pathwayFinderPage: PathwayFinderPage
  adminPage: AdminPage
}

export const test = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  destinationProfilePage: async ({ page }, use) => {
    await use(new DestinationProfilePage(page))
  },
  originProfilePage: async ({ page }, use) => {
    await use(new OriginProfilePage(page))
  },
  pathwayFinderPage: async ({ page }, use) => {
    await use(new PathwayFinderPage(page))
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page))
  },
  context: async ({ context }, use) => {
    await use(context)
  }
})

export { expect } from '@playwright/test'
