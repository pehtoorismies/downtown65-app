import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import type { EventInfo } from '../../support/event-info'
import type { EventType } from '~/generated/graphql'

export class EventWizard {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async eventTypeClick(eventType: EventType) {
    await this.page.getByTestId(`button-${eventType}`).click()
  }

  async stepBtnClick(
    step: 'type' | 'basic-info' | 'date' | 'time' | 'description' | 'preview'
  ) {
    await this.page.getByTestId(`step-${step}`).click()
  }

  getInputTitle() {
    return this.page.getByRole('textbox', { name: 'Tapahtuman nimi' })
  }

  getInputSubtitle() {
    return this.page.getByRole('textbox', { name: 'Tarkenne' })
  }

  getInputLocation() {
    return this.page.getByRole('textbox', {
      name: 'Missä tapahtuma järjestetään?',
    })
  }

  async fillTitle(title: string) {
    await this.getInputTitle().fill(title)
  }

  async fillSubtitle(subtitle: string) {
    await this.getInputSubtitle().fill(subtitle)
  }

  async fillLocation(location: string) {
    await this.getInputLocation().fill(location)
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

  async raceSwitchClick() {
    // cy.getByDataCy('race-switch').parent().click()
    await this.page.getByText('Onko kilpailu?').click()
  }

  expectEventTypeSelected(eventType: EventType) {
    expect(this.page.getByTestId(`button-${eventType}-selected`)).toBeDefined()
  }

  getStepHeading() {
    return this.page.getByRole('heading', { level: 2 })
  }

  async headerVisible(text: string) {
    await expect(this.getStepHeading()).toContainText(text)
  }

  async clickButton(text: string | RegExp) {
    await this.page.getByRole('button', { name: text }).click()
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

  async fillDescription(description: string) {
    if (description.trim().length === 0) {
      return
    }

    await this.page.locator('#rte').getByRole('paragraph').click()
    await this.page.locator('.tiptap').fill(description)
  }

  async fillEventInfo({
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

  async selectDate(now: Date, date: Date) {
    const currentMonthYearFi = format(now, 'LLLL yyyy', {
      locale: fi,
    }).toLowerCase()

    await this.page
      .getByRole('button', { name: currentMonthYearFi, exact: true })
      .click()

    const monthAbbreviatedFi = format(date, 'LLL', { locale: fi }).toLowerCase()
    const dayMonthFi = format(date, 'd LLLL', { locale: fi }).toLowerCase()

    if (date.getFullYear() !== now.getFullYear()) {
      await this.page.getByRole('button', { name: format(now, 'yyyy') }).click()
      await this.page
        .getByRole('button', { name: format(date, 'yyyy') })
        .click()
    }

    await this.page.getByRole('button', { name: monthAbbreviatedFi }).click()
    await this.page.getByLabel(new RegExp(`^${dayMonthFi}`)).click()
  }

  getCancelModalContent() {
    return this.page.getByTestId('confirmation-modal-content')
  }

  async cancelClick() {
    await this.page.getByTestId('cancel-event-creation-button').click()
    await expect(this.getCancelModalContent()).toBeVisible()
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

  async actionCreateEvent(eventInfo: EventInfo): Promise<string> {
    await this.page.getByTestId(`button-${eventInfo.type}`).click()
    await this.headerVisible('Perustiedot')
    await this.fillEventInfo(eventInfo)

    await this.clickButton('Päivämäärä')
    await this.selectDate(new Date(), eventInfo.date)

    await this.clickButton('Kellonaika')

    if (eventInfo.time !== null) {
      await this.hourClick(eventInfo.time.hours)
      await this.minuteClick(eventInfo.time.minutes)
    }

    await this.clickButton('Kuvaus')
    await this.fillDescription(eventInfo.description)

    await this.clickButton('Esikatselu')
    await this.headerVisible('Esikatselu')

    // create
    await this.page.getByRole('button', { name: /Luo tapahtuma/ }).click()
    await this.page.waitForURL(/events\/([\dA-Z]{26})$/)
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
