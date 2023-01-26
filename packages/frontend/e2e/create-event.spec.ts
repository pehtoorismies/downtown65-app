import {
  randCity,
  randNumber,
  randProductName,
  randSports,
} from '@ngneat/falso'
import { test as base, expect } from '@playwright/test'
import { NewEventPage } from './page-objects/new-event-page'
import { testUser } from './test-user'
import { EventType } from '~/gql/types.gen'

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
    await expect(newEventPage.getCancelModal()).toBeHidden()

    const eventTypes = Object.values(EventType)

    await newEventPage.eventTypeClick(
      eventTypes[randNumber({ min: 0, max: eventTypes.length - 1 })]
    )
    await newEventPage.headerVisible('Perustiedot')
    await newEventPage.cancelClick()
    await expect(newEventPage.getCancelModal()).toBeVisible()
    await newEventPage.modalClick('closeWithButton')
    await expect(newEventPage.getCancelModal()).toBeHidden()

    await newEventPage.cancelClick()
    await expect(newEventPage.getCancelModal()).toBeVisible()
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

    await expect(newEventPage.nextBtn()).toBeHidden()
    await expect(newEventPage.prevBtn()).toBeHidden()

    // 1. step type
    await newEventPage.headerVisible('Laji')
    await expect(newEventPage.skipStepBtn()).toBeDisabled()
    // clicking should not do anything
    await newEventPage.stepBtnClick('preview')
    await newEventPage.eventTypeClick(initType)
    await expect(newEventPage.nextBtn()).toBeHidden()
    await newEventPage.prevBtnClick()
    await newEventPage.eventTypeSelected(initType)
    await newEventPage.eventTypeClick(selectedType)
    await newEventPage.eventTypeSelected(selectedType)
    await newEventPage.nextBtnClick()

    // 2. step basic info
    await newEventPage.headerVisible('Perustiedot')
    await expect(newEventPage.nextBtn()).toBeHidden()
    await expect(newEventPage.skipStepBtn()).toBeDisabled()
    // clicking should not do anything
    await newEventPage.stepBtnClick('description')
    await newEventPage.fillTitle(title)
    await expect(newEventPage.nextBtn()).toBeHidden()
    await newEventPage.fillSubtitle(subtitle)
    await expect(newEventPage.nextBtn()).toBeHidden()
    await newEventPage.fillLocation(location)
    await expect(newEventPage.nextBtn()).toBeVisible()
    await newEventPage.raceSwitchClick()
    await newEventPage.nextBtnClick()

    // 3. step date
    await newEventPage.headerVisible('Päivämäärä')
    await expect(newEventPage.skipStepBtn()).toBeDisabled()
    // await expect(
    //   page
    //     .getByRole('button', { name: new Date().getDate().toString() })
    //     .filter({ has: page.locator() })
    // ).toHaveAttribute('data-selected', 'true')

    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Esikatselu')
    await newEventPage.stepBtnClick('date')
    await newEventPage.nextBtnClick()

    // 4. step time
    await newEventPage.skipStepBtn().click()
    await newEventPage.headerVisible('Vapaa kuvaus')
    await newEventPage.prevBtnClick()
    await newEventPage.headerVisible('Kellonaika')
    await expect(newEventPage.skipStepBtn()).toBeEnabled()
    await expect(newEventPage.getTimeDisplay()).toHaveText('ei aikaa')
    await newEventPage.hourClick(14)
    await expect(newEventPage.getTimeDisplay()).toHaveText('14:xx')
    await newEventPage.clearTimeClick()
    await expect(newEventPage.getTimeDisplay()).toHaveText('ei aikaa')
    await newEventPage.hourClick(14)
    await newEventPage.minuteClick(55)
    await expect(newEventPage.getTimeDisplay()).toHaveText('14:55')
    await newEventPage.nextBtnClick()

    // 5. step description
    await newEventPage.headerVisible('Vapaa kuvaus')
    await expect(newEventPage.skipStepBtn()).toBeEnabled()
    // TODO: add some text description
    await newEventPage.nextBtnClick()

    // step preview
    await newEventPage.headerVisible('Esikatselu')
    await expect(newEventPage.skipStepBtn()).toBeDisabled()

    await expect(newEventPage.getTitle()).toHaveText(title)
    await expect(newEventPage.getSubtitle()).toHaveText(subtitle)
    await expect(newEventPage.getLocation()).toHaveText(location)
    await expect(newEventPage.getRace()).toBeVisible()

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
    await newEventPage.headerVisible('Perustiedot')

    await newEventPage.stepBtnClick('date')
    await newEventPage.headerVisible('Päivämäärä')

    await newEventPage.stepBtnClick('time')
    await newEventPage.headerVisible('Kellonaika')

    await newEventPage.stepBtnClick('description')
    await newEventPage.headerVisible('Vapaa kuvaus')

    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Esikatselu')

    // create new event
    await newEventPage.nextBtnClick()

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
    await newEventPage.stepBtnClick('basic-info')
    await newEventPage.clearTitle()
    await expect(newEventPage.nextBtn()).toBeHidden()
    // // should not go anywhere
    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Perustiedot')
    await newEventPage.fillTitle(updatedTitle)
    await newEventPage.stepBtnClick('preview')
    // create
    await newEventPage.nextBtnClick()

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
    await expect(newEventPage.getDeleteConfirmationModal()).toBeVisible()
    await newEventPage.deleteModalClick('closeWithX')
    await expect(newEventPage.getDeleteConfirmationModal()).toBeHidden()

    await newEventPage.getDeleteEventBtn().click()
    await expect(newEventPage.getDeleteConfirmationModal()).toBeVisible()
    await newEventPage.deleteModalClick('closeWithButton')
    await expect(newEventPage.getDeleteConfirmationModal()).toBeHidden()

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
