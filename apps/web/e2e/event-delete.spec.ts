import { test as base, expect } from '@playwright/test'
import { EventPage } from './page-objects/event-page'
import { getRandomEventInfo } from './support/random-event'

const test = base.extend<{ eventPage: EventPage }>({
  eventPage: async ({ page }, use) => {
    const createEventPage = new EventPage(page)
    await createEventPage.create.goto()
    await createEventPage.wizard.headerVisible('Laji')
    await use(createEventPage)
  },
})

test.describe('Delete event', () => {
  test('should delete event', async ({ eventPage }) => {
    const [eventInfo, id] =
      await test.step('Create a new event for deletion', async () => {
        const eventInfo = getRandomEventInfo()
        const id = await eventPage.wizard.actionCreateEvent(eventInfo)
        await eventPage.view.goto(id)
        return [eventInfo, id]
      })

    await expect(eventPage.view.getTitle()).toHaveText(eventInfo.title)

    await test.step('Close delete confirmation modal with X', async () => {
      await eventPage.view.getDeleteEventBtn().click()
      await expect(
        eventPage.view.getDeleteConfirmationModalContent()
      ).toBeVisible()
      await eventPage.view.deleteModalClick('closeWithX')
      await expect(
        eventPage.view.getDeleteConfirmationModalContent()
      ).toBeHidden()

      await test.step('Close delete confirmation modal with close button', async () => {
        await eventPage.view.getDeleteEventBtn().click()
        await expect(
          eventPage.view.getDeleteConfirmationModalContent()
        ).toBeVisible()
        await eventPage.view.deleteModalClick('closeWithButton')
        await expect(
          eventPage.view.getDeleteConfirmationModalContent()
        ).toBeHidden()
      })

      await test.step('Delete event', async () => {
        await eventPage.view.getDeleteEventBtn().click()
        await expect(eventPage.view.getDeleteConfirmationBtn()).toBeDisabled()
        await eventPage.view.getDeleteConfirmationInput().fill('wrong text')
        await expect(eventPage.view.getDeleteConfirmationBtn()).toBeDisabled()
        await eventPage.view.getDeleteConfirmationInput().fill('poista')
        await expect(eventPage.view.getDeleteConfirmationBtn()).toBeEnabled()
        await eventPage.view.getDeleteConfirmationBtn().click()
      })

      await test.step('Verify return from deletion', async () => {
        await eventPage.page.waitForURL('**/events')
        await expect(eventPage.page.getByTestId('events')).toBeVisible()
        await expect(
          eventPage.page.locator('header').getByText('Tapahtumat')
        ).toHaveAttribute('aria-current', 'page')
      })

      await test.step('Verify that event has disappeared', async () => {
        await eventPage.page.goto(`events/${id}`)
        await expect(
          eventPage.page.getByRole('heading', { name: '404' })
        ).toBeVisible()
        await eventPage.page.getByTestId('to-frontpage-button').click()
        await eventPage.page.waitForURL('**/events')
        await expect(eventPage.page.getByTestId('events')).toBeVisible()
      })
    })
  })
})
