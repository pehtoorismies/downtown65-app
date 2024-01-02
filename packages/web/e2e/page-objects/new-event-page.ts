import type { EventType } from '@downtown65-app/graphql/graphql'
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { EventPage } from './event-page'

export class NewEventPage extends EventPage {
  constructor(page: Page) {
    super(page, 'not-found')
  }

  async goto() {
    await this.page.goto('/events/new')
  }

  async cancelClick() {
    await this.page.getByTestId('cancel-event-creation-button').click()
    await expect(this.getCancelModalContent()).toBeVisible()
  }

  getCancelModalContent() {
    return this.page.getByTestId('confirmation-modal-content')
  }

  async headerVisible(text: string) {
    await expect(this.page.getByRole('heading', { level: 2 })).toContainText(
      text
    )
  }

  async modalClick(kind: 'closeWithX' | 'closeWithButton' | 'confirmCancel') {
    switch (kind) {
      case 'closeWithButton': {
        await this.page.getByTestId('modal-close').click()
        await expect(this.getCancelModalContent()).toBeHidden()
        return
      }
      case 'closeWithX': {
        await this.page.locator("button[aria-label='Close']").click()
        await expect(this.getCancelModalContent()).toBeHidden()
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

  expectEventTypeSelected(eventType: EventType) {
    expect(this.page.getByTestId(`button-${eventType}-selected`)).toBeDefined()
  }

  async stepBtnClick(
    step: 'type' | 'basic-info' | 'date' | 'time' | 'description' | 'preview'
  ) {
    await this.page.getByTestId(`step-${step}`).click()
  }

  async clearTitle() {
    await this.page.getByRole('textbox', { name: 'Tapahtuman nimi' }).clear()
  }

  async fillTitle(title: string) {
    await this.page
      .getByRole('textbox', { name: 'Tapahtuman nimi' })
      .fill(title)
  }

  async fillSubtitle(subtitle: string) {
    await this.page.getByRole('textbox', { name: 'Tarkenne' }).fill(subtitle)
  }

  async fillLocation(location: string) {
    await this.page
      .getByRole('textbox', { name: 'Missä tapahtuma järjestetään?' })
      .fill(location)
  }

  async hourClick(hour: number) {
    if (!Number.isInteger(hour) || hour > 24 || hour < 0) {
      throw new Error('Wrong hour provided')
    }
    await this.page.getByTestId(`hour-${hour}`).click()
  }

  async minuteClick(minute: number) {
    if (!Number.isInteger(minute) || minute < 0 || minute % 5 !== 0) {
      throw new Error('Wrong minute provided')
    }
    await this.page.getByTestId(`minute-${minute}`).click()
  }

  async clearTimeClick() {
    await this.page.getByTestId('clear-time').click()
  }

  getParticipants() {
    return this.page.getByTestId('event-participant')
  }

  async raceSwitchClick() {
    // cy.getByDataCy('race-switch').parent().click()
    await this.page.getByText('Onko kilpailu?').click()
  }

  async clickThroughStepsFromBasicInfo() {
    await this.headerVisible('Perustiedot')

    await this.clickButton('Päivämäärä')
    await this.headerVisible('Päivämäärä')

    await this.clickButton('Kellonaika')
    await this.headerVisible('Kellonaika')

    await this.clickButton('Kuvaus')
    await this.headerVisible('Vapaa kuvaus')

    await this.clickButton('Esikatselu')
    await this.headerVisible('Esikatselu')
  }

  async fillBasicInfo({
    title,
    subtitle,
    location,
  }: {
    title: string
    subtitle: string
    location: string
  }) {
    await this.fillTitle(title)
    await this.fillSubtitle(subtitle)
    await this.fillLocation(location)
  }

  async createEvent(basicInfo: {
    title: string
    subtitle: string
    location: string
    type: EventType
  }): Promise<string> {
    await this.page.getByTestId(`button-${basicInfo.type}`).click()
    await this.headerVisible('Perustiedot')
    await this.fillBasicInfo(basicInfo)

    await this.clickThroughStepsFromBasicInfo()

    await this.page.getByRole('button', { name: 'Luo tapahtuma' }).click()

    await expect(
      this.page.getByRole('button', { name: 'Poista tapahtuma' })
    ).toBeVisible()

    await expect(this.page.getByRole('link', { name: 'Muokkaa' })).toBeVisible()

    const eventUrl = this.page.url()

    const m = eventUrl.match(/\/([\dA-Z]{26})$/)
    if (!m || !m[1]) {
      throw new Error('Wrong url')
    }
    return m[1]
  }
}
