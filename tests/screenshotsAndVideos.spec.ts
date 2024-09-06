import {test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200')
})

test('parametrized methos',async ({page}) => {
  const pm = new PageManager(page)
  await pm.navigateTo().formLayoutsPage()
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithredentialsAndSelectOption('test1@test.com', 'Password1', 'Option 1')

  // adding screenshot of the current state of website
  await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})

  // save the screenshot and send it to the other system
  const buffer = await page.screenshot()
  console.log(buffer.toString('base64'))

  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', true)

  // adding screenshot of this element
  await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})

  await pm.navigateTo().datepickerPage()
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)
})
