import {test, expect} from '@playwright/test'
import { delay } from 'rxjs-compat/operator/delay'

test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200')
})

test.describe('Form Layouts page', () => {
  test.beforeEach(async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('input fields',async ({page}) => {
    const usingTheGridEmailInput = page.locator('nb-card',
      {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})

    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially('test2@test.com',
      {delay:500})

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('test2@test.com');

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

test('checkboxes',async ({page}) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toaster').click()

  // click on the checkbox with name Hide on click
  // the check method, only select the checkbox and doesn't deselect the checkbox
  // the uncheck method, only deselect the checkbox and doesn't select the checkbox
  // the click method, only clicks on the checkbox and doesn't care it's selected or deselected. so it's better to always use check and uncheck method
  await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true}) // if the element is visually hidden, we should use force: true

  // check all of the checkboxes
  const allBoxes = page.getByRole('checkbox')
  for (const box of await allBoxes.all()){
    await box.check({force: true})
    expect(await box.isChecked()).toBeTruthy()
  }

  // uncheck all of the checkboxes
  const uncheckAllBoxes = page.getByRole('checkbox')
  for (const box of await uncheckAllBoxes.all()){
    await box.uncheck({force: true})
    expect(await box.isChecked()).toBeFalsy()
  }
})

test('lists and drop downs', async({page}) => {
  // click on the dropdown menu
  const dropDownMenu = page.locator('ngx-header nb-select')
  await dropDownMenu.click()

  page.getByRole('list') // when the list has a ul tag
  page.getByRole('listitem') // when the list has a li tag

  // find all of the items of the list way 1
  const optionList1 = page.getByRole('list').locator('nb-option')

  // find all of the item of the list way 2 and make assertion if they are correct or not
  const optionList2 = page.locator('nb-option-list nb-option')
  await expect(optionList2).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])

  // when select an item of the list, the background color of the page should be change
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  // select every item of the list one by one and then validate the background color is correct or not
  const colors = {
    "Light": "rgb(255, 255, 255",
    "Dark": "rgb(255, 255, 255",
    "Cosmic": "rgb(255, 255, 255",
    "Corporate": "rgb(255, 255, 255",
  }

  await dropDownMenu.click()
  for (const color in colors){
    await optionList2.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])
    // will close the list when all of the item is selected
    if (color != 'Corporate')
      await dropDownMenu.click()
  }
})

test ('tooltips',async ({page}) => {
  // for inspect element the tooltip, go to the Source tab and then press command + back slash to freeze the page and then we can find the tooltip element in the Elements tab
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  // find the tooltip and hover the button to show the tooltip
  const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
  await toolTipCard.getByRole('button', {name:'Top'}).hover()

  page.getByRole('tooltip') // if you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box of browser',async ({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // is a listener to accept the browser dialog box
  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  // find a trash icon of first row of table and click on it
  await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()

  // assertion to check the first row is deleted
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web table',async ({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // --- scenario 1 ---
  // find a row of the table and click on the edit button of the row
  // but this one doesn't work, because when I click on the row of the table, the email change from html to input. so it can't find the email anymore after click
  // the solution might be doesn't work correctly because we may have two same emails on two rows
  const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
  await targetRow.locator('.nb-edit').click()
  // selecting age, edit it and then click on the checkmark
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('25')
  await page.locator('.nb-checkmark').click()

  // --- scenario 2 ---
  // go to the page 2 of the table
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()

  // we have two records with the name 11, so we select the first row with the name 11 with this filter
  const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
  await targetRowById.click()

  // and change the email and click on checkmark button to save the changes
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click()

  // add an assertion to check if the email is changed or not
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

  // --- scenario 3 ---
  // make a validation that if I search 20, show all the records that has the age 20 not showing a wrong record
  const ages = ['20', '30', '40', '200']

  for (let age of ages){
    // enter age in the search input
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)

    // all records of the table
    const ageRow = page.locator('tbody tr')

    // find all the rows that matches with the age
    for (let row of await ageRow.all()){
      const cellValue = await row.locator('td').last().textContent()

      if (age == '200'){
        expect(await page.getByRole('table').textContent()).toContain('No data found')
      } else {
        expect(cellValue).toEqual(age)
      }
    }
  }
})


test('date picker',async ({page}) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  // find and click on the date picker
  const calendarInputField = page.getByPlaceholder('Form Picker')
  await calendarInputField.click()

  let date = new Date()
  date.setDate(date.getDate() + 14)
  const expectedDate = date.getDate().toString()
  const expectedMonthShort = date.toLocaleDateString('En-US', {month: 'short'})
  const expectedMonthLong = date.toLocaleDateString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShort} ${expectedDate} ${expectedYear}`

  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
  while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }

  // select a date from current month
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
  await expect(calendarInputField).toHaveValue(dateToAssert)
})


test('sliders',async ({page}) => {
  // click on the point of the slider
  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  await tempGauge.evaluate( node => {
    node.setAttribute('cx', '232.630')
    node.setAttribute('cy', '232.630')
  })
  await tempGauge.click()

  // make mouse movement and drag the point of the slider
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded()

  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y)
  await page.mouse.move(x + 100, y + 100)
  await page.mouse.up()
  await expect(tempBox).toContainText('30')
})
