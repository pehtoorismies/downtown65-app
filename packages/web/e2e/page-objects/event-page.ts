import { expect } from '@playwright/test'
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

  getDate() {
    return this.page.getByTestId('event-date')
  }

  async expectParticipantCount(count: number) {
    await expect(this.page.getByTestId('event-participant-count')).toHaveText(
      String(count)
    )
  }

  getLeaveButton() {
    return this.page.getByTestId('leave')
  }

  getParticipateButton() {
    return this.page.getByTestId('participate')
  }

  async participateClick() {
    await this.getParticipateButton().click()
  }

  async leaveClick() {
    await this.getLeaveButton().click()
  }

  getCreatedBy() {
    return this.page.getByTestId('event-created-by')
  }

  getGotoLoginButton() {
    return this.page.getByTestId('event-goto-login')
  }

  getModifyEventBtn() {
    return this.page.getByTestId('modify-event-btn')
  }

  getDeleteEventBtn() {
    return this.page.getByTestId('delete-event-btn')
  }

  getDeleteConfirmationModalContent() {
    return this.page.getByTestId('delete-confirmation-modal-content')
  }

  async deleteModalClick(kind: 'closeWithX' | 'closeWithButton') {
    switch (kind) {
      case 'closeWithButton': {
        await this.page.getByTestId('modal-close').click()
        await expect(this.getDeleteConfirmationModalContent()).toBeHidden()
        return
      }
      case 'closeWithX': {
        await this.page.locator("button[aria-label='Close']").click()
        await expect(this.getDeleteConfirmationModalContent()).toBeHidden()
        return
      }
    }
  }

  getDeleteConfirmationInput() {
    return this.page.locator('input[name=delete-confirm]')
  }

  getDeleteConfirmationBtn() {
    return this.page.getByTestId('confirm-delete')
  }
}