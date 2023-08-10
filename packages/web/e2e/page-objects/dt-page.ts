import type { Page } from '@playwright/test'

export class DtPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  getMeta(attributeName: string, attributeValue: string) {
    return this.page.locator(`meta[${attributeName}="${attributeValue}"]`)
  }
}
