import { randNumber } from '@ngneat/falso'
import { test as base, expect } from '@playwright/test'
import { NewEventPage } from './page-objects/new-event-page'
import { EventType } from '~/gql/types.gen'

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
})
