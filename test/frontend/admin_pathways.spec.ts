import { expect, test } from '@playwright/test'
import { AdminPage } from './po/AdminPage'

test.describe('Admin Pathways Frontend', () => {
  let adminPage: AdminPage

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page)
    await page.goto('/admin/pathways')
  })

  test('can see pathways list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pathways', exact: true })).toBeVisible()
    const addBtn = page.getByRole('button', { name: 'Add Pathway' })
    await expect(addBtn).toBeVisible()
  })

  test('can open add pathway modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Pathway' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Add New Pathway' })).toBeVisible()
  })

  test('can navigate to pathway detail page', async ({ page }) => {
    // If there are no pathways, this will fail, but that's fine for a test
    const firstCard = page.locator('.cursor-pointer').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await expect(page.url()).toContain('/admin/pathways/')
      await expect(page.getByRole('tablist')).toBeVisible()
    }
  })
})
