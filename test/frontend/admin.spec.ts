import { expect, test } from '../baseFixtures'
import * as allure from 'allure-js-commons'

test.describe('Admin Dashboard', () => {
  const createdCountries: string[] = []

  test.beforeEach(async ({ adminPage }) => {
    await allure.parentSuite('Frontend')
    await allure.suite('Admin')
    await adminPage.navigate()
  })

  test.afterAll(async ({ request }) => {
    // Find all countries starting with "TestCountry_" or "DeleteMe_"
    const countries: any[] = await request.get('/api/admin/countries').then((r) => r.json())
    const toDelete = countries.filter(
      (c) => c.name.startsWith('TestCountry_') || c.name.startsWith('DeleteMe_')
    )

    for (const country of toDelete) {
      await request.delete(`/api/admin/countries/${country.id}`)
    }
  })

  test('displays countries cards', async ({ adminPage }) => {
    await expect(adminPage.pageHeading).toContainText('Countries')
    await expect(adminPage.countryCards.first()).toBeVisible()
  })

  test('shows Mauritius in the list', async ({ adminPage }) => {
    await expect(adminPage.getCountryCard('Mauritius')).toBeVisible()
  })

  test.skip('can navigate to edit country page', async ({ adminPage, page }) => {
    const card = adminPage.getCountryCard('Mauritius')
    await card.waitFor({ state: 'visible' })
    // Use click directly on the text
    await page.getByText('Mauritius', { exact: true }).first().click()
    // It's a Nuxt navigateTo call, might take a moment to change URL
    await expect(page).toHaveURL(/\/admin\/countries\/mauritius/, { timeout: 15000 })
    await expect(page.locator('h1')).toContainText('Mauritius')
  })

  test('can create a new country with custom values', async ({ adminPage, page }) => {
    await adminPage.addCountryButton.click()

    // SelectMenu items are rendered in a Portal, let's wait for the modal
    await page.getByRole('dialog').waitFor({ state: 'visible' })

    const uniqueId = Date.now().toString().slice(-4)
    const customCountry = `TestCountry_${uniqueId}`
    const customIso = `TC`

    // USelectMenu renders as a button showing the placeholder text, not an <input>
    const countrySelect = page.getByRole('button', { name: /Select a country/i })
    await countrySelect.waitFor({ state: 'visible' })
    await countrySelect.click()
    await page.keyboard.type(customCountry)

    // Select the "Create" option
    // Nuxt UI v4 might render this as a button or div
    const createOption = page.getByTestId('create-new-country')
    await createOption.waitFor({ state: 'visible' })
    await createOption.click()

    // ISO code input should appear
    await page.getByTestId('iso-input').waitFor({ state: 'visible' })
    await page.getByTestId('iso-input').fill(customIso)

    // Select custom currency
    const customCurrency = `TCC_${uniqueId}`
    await adminPage.currencyInput.click()
    await page.keyboard.type(customCurrency)
    await page.getByTestId('create-new-currency').click()

    // Select custom language
    const customLanguage = `TestLanguage_${uniqueId}`
    await adminPage.languageInput.click()
    await page.keyboard.type(customLanguage)
    await page.getByTestId('create-new-language').click()

    await adminPage.submitButton.click()

    createdCountries.push(customCountry.toLowerCase())

    await expect(page).toHaveURL(
      new RegExp(`/admin/countries/${customCountry.toLowerCase()}-destination`),
      { timeout: 15000 }
    )
    await expect(page.locator('h1')).toContainText(customCountry)
  })

  test('can edit an existing country', async ({ adminPage, page }) => {
    const countryName = 'Mauritius'
    const card = adminPage.getCountryCard(countryName)
    await card.waitFor({ state: 'visible' })

    // Click the pencil icon for Mauritius
    const editButton = adminPage.getEditButton(countryName)
    await editButton.click()

    // Modal should be open with title "Edit Country"
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Edit Country')

    // Change region and currency
    const regionSelect = dialog.locator('select')
    await regionSelect.selectOption('Asia')

    // Submit changes
    const saveButton = dialog.getByRole('button', { name: 'Save Changes' })
    await saveButton.click()

    // Modal should close
    await expect(dialog).not.toBeVisible()

    // Verify change in the list
    const updatedCard = adminPage.getCountryCard(countryName)
    await expect(updatedCard).toContainText('Asia')
  })

  test('auto-populates currency and language for pre-defined country', async ({
    adminPage,
    page
  }) => {
    await adminPage.addCountryButton.click()
    await page.getByRole('dialog').waitFor({ state: 'visible' })

    // USelectMenu renders as a button showing the placeholder text, not an <input>
    const countrySelect = page.getByRole('button', { name: /Select a country/i })
    await countrySelect.waitFor({ state: 'visible' })
    await countrySelect.click()

    // Type "Mauritius" and select it
    await page.keyboard.type('Mauritius')
    await page.getByText('Mauritius', { exact: true }).first().click()

    // Check if currency and language are auto-populated
    // Mauritius has MUR and English in seed
    await expect(adminPage.currencyInput).toContainText('MUR')
    await expect(adminPage.languageInput).toContainText('English')
    await expect(page.getByLabel(/Region/i)).toHaveValue('Africa')
  })

  test('shows error toast for duplicate country', async ({ adminPage, page }) => {
    // Create first
    await adminPage.addCountryButton.click()

    await page.getByRole('dialog').waitFor({ state: 'visible' })

    // USelectMenu renders as a button showing the placeholder text, not an <input>
    const countrySelect = page.getByRole('button', { name: /Select a country/i })
    await countrySelect.waitFor({ state: 'visible' })
    await countrySelect.click()
    await page.keyboard.type('Mauritius')
    await page.keyboard.press('Enter')
    await adminPage.submitButton.click()

    // Wait for error toast (Mauritius already exists in seed)
    await expect(page.getByText(/country already exists/i)).toBeVisible()
  })

  test('can fetch details for a custom country', async ({ adminPage, page }) => {
    await adminPage.addCountryButton.click()

    await page.getByRole('dialog').waitFor({ state: 'visible' })

    // USelectMenu renders as a button showing the placeholder text, not an <input>
    const countrySelect = page.getByRole('button', { name: /Select a country/i })
    await countrySelect.waitFor({ state: 'visible' })
    await countrySelect.click()
    await page.keyboard.type('Austria')

    // Select the "Create" option
    await page.getByTestId('create-new-country').click()

    // Click "Fetch Details" button
    const fetchBtn = page.getByRole('button', { name: /fetch details/i })
    await fetchBtn.waitFor({ state: 'visible' })
    await fetchBtn.click()

    // Check if fields are auto-populated
    await expect(page.getByTestId('iso-input')).toHaveValue('AT')
    await expect(adminPage.currencyInput).toContainText('EUR')
    // Austria primary language in restcountries is German
    await expect(adminPage.languageInput).toContainText('German')
    // Region should be Europe (selected by default but confirmed by fetch)
    await expect(page.getByLabel(/Region/i)).toHaveValue('Europe')

    // Success toast should be visible
    await expect(page.getByText(/loaded data for Austria/i)).toBeVisible()
  })

  test('can delete a country', async ({ adminPage, page, request }) => {
    // 1. Create a country via API first to have something to delete
    // We use unique name and isoCode to avoid conflicts
    const uniqueId = Date.now().toString().slice(-6)
    const name = `DeleteMe_${uniqueId}`
    const isoCode = `D${uniqueId.slice(-1)}${uniqueId.slice(-2, -1)}`.slice(0, 2).toUpperCase()

    const response = await request.post('/api/admin/countries', {
      data: {
        name: name,
        isoCode: isoCode,
        region: 'europe',
        currencyCode: 'EUR',
        languagePrimary: 'English',
        hasDestinationProfile: true,
        hasOriginProfile: false
      }
    })

    if (!response.ok()) {
      const error = await response.json()
      console.error('Failed to create country for deletion test:', error)
    }
    expect(response.ok()).toBeTruthy()

    // 2. Refresh page to see the new country
    await adminPage.navigate()
    await expect(adminPage.getCountryCard(name)).toBeVisible()

    // 3. Click delete button
    const deleteBtn = adminPage.getDeleteButton(name)
    await deleteBtn.click()

    // 4. Confirm deletion in modal
    const confirmBtn = adminPage.getConfirmDeleteButton()
    await confirmBtn.waitFor({ state: 'visible' })
    await confirmBtn.click()

    // 5. Verify it's gone from the list
    await expect(adminPage.getCountryCard(name)).not.toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/country deleted successfully/i)).toBeVisible()
  })
})
