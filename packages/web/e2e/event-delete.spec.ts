import { test as base, expect } from '@playwright/test'
import { EventPage } from './page-objects/event-page'
import { NewEventPage } from './page-objects/new-event-page'
import { getRandomEventInfo } from './support/random-event'

const test = base.extend<{ newEventPage: NewEventPage }>({
  newEventPage: async ({ page }, use) => {
    const newEventPage = new NewEventPage(page)
    await newEventPage.goto()
    await newEventPage.headerVisible('Laji')
    await use(newEventPage)
  },
})

test.describe('Delete event', () => {
  test('should edit event page', async ({ page, newEventPage }) => {
    const eventInfo = getRandomEventInfo()
    const id = await newEventPage.actionCreateEvent(eventInfo)
    const eventPage = new EventPage(page, id)
    await eventPage.goto()

    await expect(newEventPage.getTitle()).toHaveText(eventInfo.title)

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

    await page.goto(`events/${id}`)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await page.getByTestId('to-frontpage-button').click()
    await page.waitForURL('**/events')
    await expect(page.getByTestId('events')).toBeVisible()
  })
})
