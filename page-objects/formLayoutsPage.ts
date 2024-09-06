import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayoutsPage extends HelperBase{

  constructor(page: Page){
    super(page)
  }

  async submitUsingTheGridFormWithredentialsAndSelectOption(email: string, password: string, optionText: string){
    const usingTheGridForm = this.page.locator('nb-card', {hasText: 'Using the Grid'})
    await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
    await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password)
    await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true}) // force true because we want to enable it and then click on it
    await usingTheGridForm.getByRole('button').click()
  }

  /**
   * This method fill ouut the Inline form with user details
   * @param name - should be first and last name
   * @param email - valid email of user
   * @param rememberMe - the remember user details checkbox
   */
  async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){
    const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'})
    await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
    await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
    if (rememberMe)
      await inlineForm.getByRole('checkbox').check({force: true})
    await inlineForm.getByRole('button').click()
  }
}
