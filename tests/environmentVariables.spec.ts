import {test} from '../testOptions'

test.beforeEach(async ({page}) => {
  // we put / because we defined the base url env into the playwright.config.ts
  await page.goto('/')
})

test('open urls from environment variables', async({page, globalsQaURL}) => {
  // we use the url that we defined it in the testOptions.ts and playwright.config.ts files
  await page.goto(globalsQaURL)
})

test.afterEach(async ({page}) => {
  // we use the url that we defined it in the .env file, we should user dotenv
  await page.goto(process.env.URL)
})
