import type { Page } from '@playwright/test'
import { DtPage } from './dt-page'

export class EventPage extends DtPage {
  readonly eventId: string

  constructor(page: Page, eventId: string) {
    super(page)
    this.eventId = eventId
  }

  async goto() {
    await this.page.goto(`/events/${this.eventId}`)
  }

  getTitle() {
    return this.page.getByTestId('event-title')
  }

  getRace() {
    return this.page.getByTestId('event-race')
  }

  getSubtitle() {
    return this.page.getByTestId('event-subtitle')
  }

  getLocation() {
    return this.page.getByTestId('event-location')
  }

  getParticipantCount() {
    return this.page.getByTestId('event-participant-count')
  }

  getLeaveButton() {
    return this.page.getByTestId('leave')
  }

  getParticipateButton() {
    return this.page.getByTestId('participate')
  }

  getGotoLoginButton() {
    return this.page.getByTestId('event-goto-login')
  }
}
