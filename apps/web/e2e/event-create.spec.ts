import { test as base, expect } from '@playwright/test'
import { format } from 'date-fns'
import { EventPage } from './page-objects/event-page'
import {
  getRandomEventInfo,
  getRandomEventType,
  getRandomEventTypes,
} from './support/random-event'
import { testUser } from './test-user'

const test = base.extend<{ eventPage: EventPage }>({
  eventPage: async ({ page }, use) => {
    const createEventPage = new EventPage(page)
    await createEventPage.create.goto()
    await createEventPage.wizard.headerVisible('Laji')
    await use(createEventPage)
  },
})

test.describe('Create event', () => {
  test('should cancel new event creation', async ({ eventPage }) => {
    await eventPage.wizard.cancelClick()
    await eventPage.wizard.modalClick('closeWithX')
    await expect(eventPage.wizard.getCancelModalContent()).toBeHidden()

    await eventPage.wizard.eventTypeClick(getRandomEventType())

    await eventPage.wizard.headerVisible('Perustiedot')
    await eventPage.wizard.cancelClick()
    await expect(eventPage.wizard.getCancelModalContent()).toBeVisible()
    await eventPage.wizard.modalClick('closeWithButton')
    await expect(eventPage.wizard.getCancelModalContent()).toBeHidden()

    await eventPage.wizard.cancelClick()
    await expect(eventPage.wizard.getCancelModalContent()).toBeVisible()
    await eventPage.wizard.modalClick('confirmCancel')
    await eventPage.page.waitForURL('**/events')
  })

  test('should navigate creation wizard and then create event', async ({
    eventPage,
  }) => {
    const shuffled = getRandomEventTypes()
    const { title, subtitle, location, date, description } = getRandomEventInfo(
      {},
    )

    const userNick = testUser.nick
    const initType = shuffled[0]
    const selectedType = shuffled[1]

    // 1. step type
    await eventPage.wizard.headerVisible('Laji')
    await eventPage.wizard.stepBtnClick('preview')
    await eventPage.wizard.headerVisible('Laji')
    await eventPage.wizard.eventTypeClick(initType)
    await eventPage.wizard.headerVisible('Perustiedot')
    await eventPage.wizard.clickButton('Laji')
    eventPage.wizard.expectEventTypeSelected(initType)
    await eventPage.wizard.eventTypeClick(selectedType)
    eventPage.wizard.expectEventTypeSelected(selectedType)
    await eventPage.wizard.clickButton('Perustiedot')
    await eventPage.wizard.headerVisible('Perustiedot')
    await eventPage.wizard.clickButton('Laji')
    await eventPage.wizard.headerVisible('Laji')
    eventPage.wizard.expectEventTypeSelected(selectedType)
    await eventPage.wizard.clickButton('Perustiedot')

    // 2. step basic info
    await eventPage.wizard.headerVisible('Perustiedot')
    // next steps disallowed
    await eventPage.wizard.stepBtnClick('description')
    await eventPage.wizard.headerVisible('Perustiedot')
    // previous steps allowed
    await eventPage.wizard.stepBtnClick('type')
    await eventPage.wizard.headerVisible('Laji')
    await eventPage.wizard.clickButton('Perustiedot')
    await eventPage.wizard.headerVisible('Perustiedot')

    // errors in fields
    await eventPage.wizard.clickButton('Päivämäärä')
    await eventPage.wizard.headerVisible('Perustiedot')

    await expect(
      eventPage.page.getByText('Nimi ei voi olla tyhjä'),
    ).toBeVisible()
    await expect(
      eventPage.page.getByText('Tarkenne ei voi olla tyhjä'),
    ).toBeVisible()
    await expect(
      eventPage.page.getByText('Sijainti ei voi olla tyhjä'),
    ).toBeVisible()

    await eventPage.wizard.fillTitle('   ')
    await eventPage.wizard.fillSubtitle('   ')
    await eventPage.wizard.fillLocation('Kerava')
    await eventPage.wizard.clickButton('Päivämäärä')

    await expect(
      eventPage.page.getByText('Nimi ei voi olla tyhjä'),
    ).toBeVisible()
    await expect(
      eventPage.page.getByText('Tarkenne ei voi olla tyhjä'),
    ).toBeVisible()
    await expect(
      eventPage.page.getByText('Sijainti ei voi olla tyhjä'),
    ).not.toBeVisible()

    // clicking should not do anything
    await eventPage.wizard.stepBtnClick('description')
    await eventPage.wizard.headerVisible('Perustiedot')

    await eventPage.wizard.fillTitle(title)
    await eventPage.wizard.fillSubtitle(subtitle)
    await eventPage.wizard.fillLocation(location)
    await eventPage.wizard.raceSwitchClick()
    await eventPage.wizard.clickButton('Päivämäärä')

    // 3. step date
    await eventPage.wizard.headerVisible(
      `Päivämäärä: ${format(new Date(), 'd.M.yyyy')}`,
    )
    await eventPage.wizard.selectDate(new Date(), date)
    await eventPage.wizard.headerVisible(
      `Päivämäärä: ${format(date, 'd.M.yyyy')}`,
    )

    await eventPage.wizard.headerVisible('Päivämäärä')
    await eventPage.wizard.clickButton('Kellonaika')

    // 4. step time
    await eventPage.wizard.headerVisible('Kellonaika')
    await eventPage.wizard.clickButton('Kuvaus')
    await eventPage.wizard.headerVisible('Vapaa kuvaus')
    await eventPage.wizard.clickButton('Kellonaika')
    await eventPage.wizard.headerVisible('Kellonaika')
    await eventPage.wizard.hourClick(14)
    await eventPage.wizard.headerVisible('Kellonaika: 14:xx')
    await eventPage.wizard.clearTimeClick()
    await eventPage.wizard.headerVisible('Kellonaika')
    await eventPage.wizard.hourClick(14)
    await eventPage.wizard.minuteClick(55)
    await eventPage.wizard.headerVisible('Kellonaika: 14:55')
    await eventPage.wizard.clickButton('Kuvaus')

    // 5. step description
    await eventPage.wizard.headerVisible('Vapaa kuvaus')
    await eventPage.wizard.fillDescription(description)

    await eventPage.wizard.clickButton('Esikatselu')

    // step preview
    await eventPage.wizard.headerVisible('Esikatselu')

    await expect(eventPage.view.getTitle()).toHaveText(title)
    await expect(eventPage.view.getSubtitle()).toHaveText(subtitle)
    await expect(eventPage.view.getLocation()).toHaveText(location)
    await expect(eventPage.view.getRace()).toBeVisible()

    // Date start and time
    await expect(eventPage.view.getDate()).toContainText(
      format(date, 'd.M.yyyy'),
    )
    await expect(eventPage.view.getDate()).toHaveText(/14:55$/)

    await eventPage.view.expectParticipantCount(0)
    await eventPage.view.participateClick()
    await eventPage.view.expectParticipantCount(1)

    await expect(
      eventPage.view.getParticipants().getByText(userNick),
    ).toBeVisible()

    await eventPage.view.leaveClick()
    await eventPage.view.expectParticipantCount(0)
    await eventPage.view.participateClick()
    await expect(eventPage.view.getCreatedBy()).toHaveText(
      new RegExp(`${userNick}$`),
    )

    // just click through steps
    await eventPage.wizard.stepBtnClick('type')
    await eventPage.wizard.headerVisible('Laji')

    await eventPage.wizard.stepBtnClick('basic-info')
    await eventPage.wizard.headerVisible('Laji')
    await eventPage.wizard.clickButton('Perustiedot')

    await eventPage.wizard.clickThroughStepsFromBasicInfo()

    // create new event
    await eventPage.wizard.clickButton(/Luo tapahtuma/)

    const idRegExp = /\/([\dA-Z]{26})$/
    await eventPage.page.waitForURL(idRegExp)
    const m = eventPage.page.url().match(/\/([\dA-Z]{26})$/)
    if (!m || !m[1]) {
      throw new Error('Wrong url')
    }
  })
})
