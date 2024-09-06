import { Locator, Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NavigationPage extends HelperBase{

  constructor(page: Page){
    super(page)
  }

  // this approach is very good and is very simple
  async formLayoutsPage(){
    await this.selectGroupMenuItem('Forms')
    await this.page.getByText('Form Layouts').click()
    await this.waitForNumberOfSeconds(2)
  }

  async datepickerPage(){
    await this.selectGroupMenuItem('Forms')
    //await this.page.waitForTimeout(1000)
    await this.page.getByText('Datepicker').click()
  }

  async smartTablePage(){
    await this.selectGroupMenuItem('Tables & Data')
    await this.page.getByText('Smart Table').click()
  }

  async toastrPage(){
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Toaster').click()
  }

  async tooltipPage(){
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Tooltip').click()
  }

  // for checking the menu is expanded or not before clicking on it. It's private because it just uses by this page not other pages
  private async selectGroupMenuItem(groupItemTitle: string){
    const groupMenuItem = this.page.getByTitle(groupItemTitle)
    const expandedStatus = await groupMenuItem.getAttribute('aria-expanded')
    if(expandedStatus == 'false')
      await groupMenuItem.click()
  }
}
