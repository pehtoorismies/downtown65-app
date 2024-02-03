import { toFormattedDate, toISODate, toISOTime } from '@downtown65-app/time'
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import invariant from 'tiny-invariant'
import type { EventInfo } from '../../support/event-info'

export class ViewableEvent {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(eventId: string) {
    await this.page.goto(`/events/${eventId}`)
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

  getParticipants() {
    // TODO: plural test-id perhaps?
    return this.page.getByTestId('event-participant')
  }

  getCreatedBy() {
    return this.page.getByTestId('event-created-by')
  }

  async expectParticipantCount(count: number) {
    await expect(this.page.getByTestId('event-participant-count')).toHaveText(
      String(count)
    )
  }

  getGotoLoginButton() {
    return this.page.getByTestId('event-goto-login')
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

  getModifyEventBtn() {
    return this.page.getByTestId('modify-event-btn')
  }

  getDeleteConfirmationBtn() {
    return this.page.getByTestId('confirm-delete')
  }

  getDeleteEventBtn() {
    return this.page.getByTestId('delete-event-btn')
  }

  getDeleteConfirmationInput() {
    return this.page.locator('input[name=delete-confirm]')
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

  async actionDeleteEvent() {
    await this.getDeleteEventBtn().click()
    await this.getDeleteConfirmationInput().fill('poista')
    await this.getDeleteConfirmationBtn().click()
    await this.page.waitForURL('**/events')
  }

  async verifyEventInfo(eventInfo: EventInfo) {
    await expect(this.getTitle()).toHaveText(eventInfo.title)
    await expect(this.getSubtitle()).toHaveText(eventInfo.subtitle)
    await expect(this.getLocation()).toHaveText(eventInfo.location)

    const dateText = await this.getDate().textContent()
    const isoDate = toISODate(eventInfo.date)
    invariant(isoDate.success)

    if (eventInfo.time) {
      const isoTime = toISOTime(eventInfo.time)
      invariant(isoTime.success)
      expect(dateText).toBe(
        `${toFormattedDate(isoDate.data)} klo ${isoTime.data}`
      )
    } else {
      expect(dateText).toBe(toFormattedDate(isoDate.data))
    }

    await (eventInfo.description.trim().length === 0
      ? expect(
          this.page.getByText('ei tarkempaa tapahtuman kuvausta')
        ).toBeVisible()
      : expect(this.page.getByText(eventInfo.description)).toBeVisible())
  }
}
