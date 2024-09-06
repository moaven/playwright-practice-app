import {test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200')
})

test('parametrized methos',async ({page}) => {
  const pm = new PageManager(page)
  const randomFullName = faker.name.fullName()
  const randomEmail = `${randomFullName.replace(' ', '.')}${faker.random.numeric(4)}@test.com`

  await pm.navigateTo().formLayoutsPage()
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithredentialsAndSelectOption('test1@test.com', 'Password1', 'Option 1')
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})
