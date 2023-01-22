import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class NewEventPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/events/new')
  }

  async createEvent({
    title,
    subtitle,
    location,
  }: {
    title: string
    subtitle: string
    location: string
  }): Promise<string> {
    await this.page.getByTestId('button-CYCLING').click()
    await expect(
      this.page.getByRole('heading', { name: 'Perustiedot' })
    ).toBeVisible()

    await this.page
      .getByRole('textbox', { name: 'Tapahtuman nimi' })
      .fill(title)
    await this.page.getByRole('textbox', { name: 'Tarkenne' }).fill(subtitle)
    await this.page
      .getByRole('textbox', { name: 'Missä tapahtuma järjestetään?' })
      .fill(location)

    await this.page.getByTestId('next-button').click()
    await this.page.getByTestId('step-preview').click()
    await this.page.getByTestId('next-button').click()
    await this.page.waitForNavigation()

    const eventUrl = this.page.url()

    const m = eventUrl.match(/\/([\dA-Z]{26})$/)
    if (!m || !m[1]) {
      throw new Error('Wrong url')
    }
    return m[1]
  }
}
