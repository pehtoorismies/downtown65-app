import type { Page } from '@playwright/test'

export class DtPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  getMeta(attributeName: string, attributeValue: string) {
    return this.page.locator(`meta[${attributeName}="${attributeValue}"]`)
  }

  async clickButton(text: string) {
    await this.page.getByRole('button', { name: text }).click()
  }
}
