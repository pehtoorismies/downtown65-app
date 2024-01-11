import { test as base, expect } from '@playwright/test'
import { format } from 'date-fns'
import { NewEventPage } from './page-objects/new-event-page'
import {
  getRandomEventInfo,
  getRandomEventType,
  getRandomEventTypes,
} from './support/random-event'
import { testUser } from './test-user'

const test = base.extend<{ newEventPage: NewEventPage }>({
  newEventPage: async ({ page }, use) => {
    const newEventPage = new NewEventPage(page)
    await newEventPage.goto()
    await newEventPage.headerVisible('Laji')
    await use(newEventPage)
  },
})

test.describe('Create event', () => {
  test('should cancel new event creation', async ({ page, newEventPage }) => {
    await newEventPage.cancelClick()
    await newEventPage.modalClick('closeWithX')
    await expect(newEventPage.getCancelModalContent()).toBeHidden()

    await newEventPage.eventTypeClick(getRandomEventType())

    await newEventPage.headerVisible('Perustiedot')
    await newEventPage.cancelClick()
    await expect(newEventPage.getCancelModalContent()).toBeVisible()
    await newEventPage.modalClick('closeWithButton')
    await expect(newEventPage.getCancelModalContent()).toBeHidden()

    await newEventPage.cancelClick()
    await expect(newEventPage.getCancelModalContent()).toBeVisible()
    await newEventPage.modalClick('confirmCancel')
    await page.waitForURL('**/events')
  })

  test('should navigate creation wizard and then create event', async ({
    newEventPage,
    page,
  }) => {
    const shuffled = getRandomEventTypes()
    const { title, subtitle, location, date, description } = getRandomEventInfo(
      {}
    )

    const userNick = testUser.nick
    const initType = shuffled[0]
    const selectedType = shuffled[1]

    // 1. step type
    await newEventPage.headerVisible('Laji')
    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Laji')
    await newEventPage.eventTypeClick(initType)
    await newEventPage.headerVisible('Perustiedot')
    await newEventPage.clickButton('Laji')
    newEventPage.expectEventTypeSelected(initType)
    await newEventPage.eventTypeClick(selectedType)
    newEventPage.expectEventTypeSelected(selectedType)
    await newEventPage.clickButton('Perustiedot')
    await newEventPage.headerVisible('Perustiedot')
    await newEventPage.clickButton('Laji')
    await newEventPage.headerVisible('Laji')
    newEventPage.expectEventTypeSelected(selectedType)
    await newEventPage.clickButton('Perustiedot')

    // 2. step basic info
    await newEventPage.headerVisible('Perustiedot')
    // next steps disallowed
    await newEventPage.stepBtnClick('description')
    await newEventPage.headerVisible('Perustiedot')
    // previous steps allowed
    await newEventPage.stepBtnClick('type')
    await newEventPage.headerVisible('Laji')
    await newEventPage.clickButton('Perustiedot')
    await newEventPage.headerVisible('Perustiedot')

    // errors in fields
    await newEventPage.clickButton('Päivämäärä')
    await newEventPage.headerVisible('Perustiedot')

    await expect(page.getByText('Nimi ei voi olla tyhjä')).toBeVisible()
    await expect(page.getByText('Tarkenne ei voi olla tyhjä')).toBeVisible()
    await expect(page.getByText('Sijainti ei voi olla tyhjä')).toBeVisible()

    await newEventPage.fillTitle('   ')
    await newEventPage.fillSubtitle('   ')
    await newEventPage.fillLocation('Kerava')
    await newEventPage.clickButton('Päivämäärä')

    await expect(page.getByText('Nimi ei voi olla tyhjä')).toBeVisible()
    await expect(page.getByText('Tarkenne ei voi olla tyhjä')).toBeVisible()
    await expect(page.getByText('Sijainti ei voi olla tyhjä')).not.toBeVisible()

    // clicking should not do anything
    await newEventPage.stepBtnClick('description')
    await newEventPage.headerVisible('Perustiedot')

    await newEventPage.fillTitle(title)
    await newEventPage.fillSubtitle(subtitle)
    await newEventPage.fillLocation(location)
    await newEventPage.raceSwitchClick()
    await newEventPage.clickButton('Päivämäärä')

    // 3. step date
    await newEventPage.headerVisible(
      `Päivämäärä: ${format(new Date(), 'd.M.yyyy')}`
    )
    await newEventPage.selectDate(new Date(), date)
    await newEventPage.headerVisible(`Päivämäärä: ${format(date, 'd.M.yyyy')}`)

    await newEventPage.headerVisible('Päivämäärä')
    await newEventPage.clickButton('Kellonaika')

    // 4. step time
    await newEventPage.headerVisible('Kellonaika')
    await newEventPage.clickButton('Kuvaus')
    await newEventPage.headerVisible('Vapaa kuvaus')
    await newEventPage.clickButton('Kellonaika')
    await newEventPage.headerVisible('Kellonaika')
    await newEventPage.hourClick(14)
    await newEventPage.headerVisible('Kellonaika: 14:xx')
    await newEventPage.clearTimeClick()
    await newEventPage.headerVisible('Kellonaika')
    await newEventPage.hourClick(14)
    await newEventPage.minuteClick(55)
    await newEventPage.headerVisible('Kellonaika: 14:55')
    await newEventPage.clickButton('Kuvaus')

    // 5. step description
    await newEventPage.headerVisible('Vapaa kuvaus')
    await newEventPage.fillDescription(description)

    await newEventPage.clickButton('Esikatselu')

    // step preview
    await newEventPage.headerVisible('Esikatselu')

    await expect(newEventPage.getTitle()).toHaveText(title)
    await expect(newEventPage.getSubtitle()).toHaveText(subtitle)
    await expect(newEventPage.getLocation()).toHaveText(location)
    await expect(newEventPage.getRace()).toBeVisible()

    // Date start and time
    await expect(newEventPage.getDate()).toContainText(format(date, 'd.M.yyyy'))
    await expect(newEventPage.getDate()).toHaveText(/14:55$/)

    await newEventPage.expectParticipantCount(0)
    await newEventPage.participateClick()
    await newEventPage.expectParticipantCount(1)

    await expect(
      newEventPage.getParticipants().getByText(userNick)
    ).toBeVisible()

    await newEventPage.leaveClick()
    await newEventPage.expectParticipantCount(0)
    await newEventPage.participateClick()
    await expect(newEventPage.getCreatedBy()).toHaveText(
      new RegExp(`${userNick}$`)
    )

    // just click through steps
    await newEventPage.stepBtnClick('type')
    await newEventPage.headerVisible('Laji')

    await newEventPage.stepBtnClick('basic-info')
    await newEventPage.headerVisible('Laji')
    await newEventPage.clickButton('Perustiedot')

    await newEventPage.clickThroughStepsFromBasicInfo()

    // create new event
    await newEventPage.clickButton('Luo tapahtuma')

    const idRegExp = /\/([\dA-Z]{26})$/
    await page.waitForURL(idRegExp)
    const m = page.url().match(/\/([\dA-Z]{26})$/)
    if (!m || !m[1]) {
      throw new Error('Wrong url')
    }
  })
})
