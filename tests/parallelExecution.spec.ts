import {test, expect} from '@playwright/test'
import { delay } from 'rxjs-compat/operator/delay'

// to run only these tests in this file in parallel, if we want to run all test in the tests folder run in parallel, we should change the settings in the playwright.config.ts file
test.describe.configure({mode: 'parallel'})

test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200')
})

test.describe.only('Form Layouts page', () => {
  // it will retry two times to run this test
  test.describe.configure({retries: 2})

  test.beforeEach(async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('input fields',async ({page}, testInfo) => {
    // if we wanted to do something before retry, for example clean the database
    if (testInfo.retry){
      // do something
    }

    const usingTheGridEmailInput = page.locator('nb-card',
      {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})

    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially('test2@test.com',
      {delay:500})

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('test2@test.com1');

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') // for the input we should use toHaveValue instead of toHaveText
  })

  test('radio buttons', async({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

    // click on the option 1 way 1
    await usingTheGridForm.getByLabel('Option 1').check({force: true}) // force true because we want to enable it and then click on it

    // click on the option 1 way 2
    await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true}) // force true because we want to enable it and then click on it

    // generic assertion way 1 (if option 1 is checked)
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
    expect(radioStatus).toBeTruthy()

    // generic assertion way 2 (if option 1 is checked)
    await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

    // click on the option 2
    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})

    // generic assertion way 1 (if option 1 is not checked anymore)
    expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
  })
})
