import { EventType } from '@downtown65-app/graphql/graphql'
import {
  randCity,
  randNumber,
  randProductName,
  randSports,
} from '@ngneat/falso'
import { test as base, expect } from '@playwright/test'
import { format } from 'date-fns'
import { addMonths, setDate } from 'date-fns/fp'
import * as R from 'remeda'
import { NewEventPage } from './page-objects/new-event-page'
import { testUser } from './test-user'

const test = base.extend<{ newEventPage: NewEventPage }>({
  newEventPage: async ({ page }, use) => {
    const newEventPage = new NewEventPage(page)
    await newEventPage.goto()
    await newEventPage.headerVisible('Laji')
    await use(newEventPage)
  },
})

const shuffleArray = <T>(array: T[]) => {
  const clonedArray = [...array]

  for (let index = clonedArray.length - 1; index > 0; index--) {
    const index_ = Math.floor(Math.random() * (index + 1))
    const temporary = clonedArray[index]
    clonedArray[index] = clonedArray[index_]
    clonedArray[index_] = temporary
  }
  return clonedArray
}

test.describe('Create event', () => {
  test('should cancel new event creation', async ({ page, newEventPage }) => {
    await newEventPage.cancelClick()
    await newEventPage.modalClick('closeWithX')
    await expect(newEventPage.getCancelModalContent()).toBeHidden()

    const eventTypes = Object.values(EventType)

    await newEventPage.eventTypeClick(
      eventTypes[randNumber({ min: 0, max: eventTypes.length - 1 })]
    )
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

  test('should create a new event, modify and delete it', async ({
    newEventPage,
    page,
  }) => {
    const shuffled = shuffleArray(Object.values(EventType))
    const title = randSports()
    const updatedTitle = randSports()
    const subtitle = randProductName()
    const location = randCity()
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
    const now = new Date()

    await newEventPage.headerVisible(`Päivämäärä: ${format(now, 'd.M.yyyy')}`)

    await newEventPage.calendarNextMonthClick()
    await newEventPage.clickButton('15')

    const nextMonthDate = R.pipe(now, addMonths(1), setDate(15))

    if (!(nextMonthDate instanceof Date)) {
      throw new TypeError('Invalid type of Date')
    }

    await newEventPage.headerVisible(
      `Päivämäärä: ${format(nextMonthDate, 'd.M.yyyy')}`
    )

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
    // TODO: add some text description

    await newEventPage.clickButton('Esikatselu')

    // step preview
    await newEventPage.headerVisible('Esikatselu')

    await expect(newEventPage.getTitle()).toHaveText(title)
    await expect(newEventPage.getSubtitle()).toHaveText(subtitle)
    await expect(newEventPage.getLocation()).toHaveText(location)
    await expect(newEventPage.getRace()).toBeVisible()

    // Date start and time
    await expect(newEventPage.getDate()).toContainText(
      format(nextMonthDate, 'd.M.yyyy')
    )
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
    const createdEventId = m[1]

    await expect(newEventPage.getModifyEventBtn()).toBeEnabled()
    await expect(newEventPage.getTitle()).toHaveText(title)
    await expect(newEventPage.getSubtitle()).toHaveText(subtitle)
    await expect(newEventPage.getLocation()).toHaveText(location)
    await expect(newEventPage.getDate()).toHaveText(/14:55$/)
    await expect(newEventPage.getRace()).toBeVisible()

    await expect(
      newEventPage.getParticipants().getByText(userNick)
    ).toBeVisible()
    await newEventPage.expectParticipantCount(1)
    await newEventPage.leaveClick()
    await newEventPage.expectParticipantCount(0)
    await newEventPage.participateClick()
    await newEventPage.expectParticipantCount(1)

    // modify event
    await newEventPage.getModifyEventBtn().click()
    await page.waitForURL(/\/events\/edit/)
    await newEventPage.headerVisible('Laji')

    await newEventPage.clickButton('Perustiedot')
    await newEventPage.getInputTitle().clear()
    await newEventPage.clickButton('Päivämäärä')
    await expect(page.getByText('Nimi ei voi olla tyhjä')).toBeVisible()
    await newEventPage.fillTitle(updatedTitle)

    // // should not go anywhere
    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Perustiedot')

    await newEventPage.clickThroughStepsFromBasicInfo()

    // create
    await newEventPage.clickButton('Tallenna')

    // check modified event
    await expect(newEventPage.getModifyEventBtn()).toBeEnabled()

    await expect(newEventPage.getRace()).toBeVisible()
    await expect(newEventPage.getTitle()).toHaveText(updatedTitle)
    await expect(newEventPage.getSubtitle()).toHaveText(subtitle)
    await expect(newEventPage.getLocation()).toHaveText(location)
    await expect(newEventPage.getDate()).toHaveText(/14:55$/)

    await expect(
      newEventPage.getParticipants().getByText(userNick)
    ).toBeVisible()
    await newEventPage.expectParticipantCount(1)

    // remove
    await newEventPage.getDeleteEventBtn().click()
    await expect(newEventPage.getDeleteConfirmationModalContent()).toBeVisible()
    await newEventPage.deleteModalClick('closeWithX')
    await expect(newEventPage.getDeleteConfirmationModalContent()).toBeHidden()

    await newEventPage.getDeleteEventBtn().click()
    await expect(newEventPage.getDeleteConfirmationModalContent()).toBeVisible()
    await newEventPage.deleteModalClick('closeWithButton')
    await expect(newEventPage.getDeleteConfirmationModalContent()).toBeHidden()

    await newEventPage.getDeleteEventBtn().click()
    await expect(newEventPage.getDeleteConfirmationBtn()).toBeDisabled()
    await newEventPage.getDeleteConfirmationInput().fill('wrong text')
    await expect(newEventPage.getDeleteConfirmationBtn()).toBeDisabled()

    await newEventPage.getDeleteConfirmationInput().fill('poista')
    await expect(newEventPage.getDeleteConfirmationBtn()).toBeEnabled()

    await newEventPage.getDeleteConfirmationBtn().click()
    await page.waitForURL('**/events')
    await expect(page.getByTestId('events')).toBeVisible()
    await expect(
      page.locator('header').getByText('Tapahtumat')
    ).toHaveAttribute('aria-current', 'page')

    await page.goto(`events/${createdEventId}`)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await page.getByTestId('to-frontpage-button').click()
    await page.waitForURL('**/events')
    await expect(page.getByTestId('events')).toBeVisible()
  })
})
