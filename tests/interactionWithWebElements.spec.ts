import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test ('Locator syntax rules', async({page}) => {
  // by Tag name
  await page.locator('input').first().click()

  // by ID
   page.locator('#inputEmail1')

  // by Class
  page.locator('.shape-rectangle')

  // by attribute
  page.locator('[placeholder="Email"]')

  // by entire class value
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  // combine different locators
  page.locator('input[placeholder="Email"]') // without space

  // by Xpath (not recommended)
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  page.locator(':text("Using")')

  // by exact text match
  page.locator(':text-is("Using the Grid")')
})

test ('User facing Locators',async ({page}) => {
  // Try to use an element that user can see
  await page.getByRole('textbox', {name: 'Email'}).first().click()
  await page.getByRole('button', {name: 'Sign in'}).first().click()

  await page.getByLabel('Email').first().click()

  await page.getByPlaceholder('Email').first().click()

  await page.getByText('Using By Grid').click()

  await page.getByTitle('Iot Dashboard').click()

  await page.getByTestId('Email').click()
})

test ('Locating child elements',async ({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()

  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click()

  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

  await page.locator('nb-card').nth(3).getByRole('button').click() // try to avoid this approach
})

test ('Locating parent elements',async ({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: 'Email'}).click()
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).click()

  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: 'Email'}).click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click()

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: 'Password'}).click()
})

test ('Reusing the locators',async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const emailField = basicForm.getByRole('textbox', {name: 'Email'})
  await emailField.fill('test@test.com')
  await basicForm.getByRole('textbox', {name: 'Password'}).fill('123456')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailField).toHaveValue('test@test.com')
})

test ('extracting values',async ({page}) => {
  // single test value
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const buttonText = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')

  // all text values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain('Option 1')

  // input value
  const emailField = basicForm.getByRole('textbox', {name: 'Email'})
  await emailField.fill('test@test.com')
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('test@test.com')

  const placeHolderValue = await emailField.getAttribute('placeholder')
  expect(placeHolderValue).toEqual('Email')
})

test ('assertions',async ({page}) => {
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

  // general assertions
  const text = await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  // locator assertions
  await expect(basicFormButton).toHaveText('Submit')

  // soft assertions
  await expect.soft(basicFormButton).toHaveText('Submit') // if the test fails, the test will continue to run
  await basicFormButton.click()
})
