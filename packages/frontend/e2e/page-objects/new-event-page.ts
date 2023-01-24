import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import type { EventType } from '~/gql/types.gen'

export class NewEventPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/events/new')
  }

  async cancelClick() {
    await this.page.getByTestId('cancel-event-creation-button').click()
    await expect(this.getCancelModal()).toBeVisible()
  }

  getCancelModal() {
    return this.page.getByTestId('confirmation-modal')
  }

  async headerVisible(text: string) {
    await expect(this.page.getByRole('heading', { level: 1 })).toContainText(
      text
    )
  }

  async modalClick(kind: 'closeWithX' | 'closeWithButton' | 'confirmCancel') {
    switch (kind) {
      case 'closeWithButton': {
        await this.page.getByTestId('modal-close').click()
        await expect(this.getCancelModal()).toBeHidden()
        return
      }
      case 'closeWithX': {
        await this.page.locator("button[aria-label='Close']").click()
        await expect(this.getCancelModal()).toBeHidden()
        return
      }
      case 'confirmCancel': {
        await this.page.getByTestId('modal-cancel-event-creation').click()
        return
      }
    }
  }

  async eventTypeClick(eventType: EventType) {
    await this.page.getByTestId(`button-${eventType}`).click()
  }

  async createEvent({
    title,
    subtitle,
    location,
    type,
  }: {
    title: string
    subtitle: string
    location: string
    type: EventType
  }): Promise<string> {
    await this.page.getByTestId(`button-${type}`).click()
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
