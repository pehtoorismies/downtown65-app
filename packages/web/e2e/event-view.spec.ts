import { test as base, expect } from '@playwright/test'
import { EventPage } from './page-objects/event-page'
import { NewEventPage } from './page-objects/new-event-page'
import { getRandomEventInfo } from './support/random-event'
import { testUser } from './test-user'

const test = base.extend<{ newEventPage: NewEventPage }>({
  newEventPage: async ({ page }, use) => {
    const newEventPage = new NewEventPage(page)
    await newEventPage.goto()
    await newEventPage.headerVisible('Laji')
    await use(newEventPage)
  },
})

test.describe('View event', () => {
  test('should not have time or description', async ({
    newEventPage,
    page,
  }) => {
    const eventInfo = getRandomEventInfo({ time: null })
    const id = await newEventPage.actionCreateEvent(eventInfo)

    const eventPage = new EventPage(page, id)
    await eventPage.goto()
    await eventPage.verifyEventInfo(eventInfo)

    await expect(
      page.getByText('ei tarkempaa tapahtuman kuvausta')
    ).toBeVisible()

    await eventPage.actionDeleteEvent()
  })

  test('should have no description', async ({ newEventPage, page }) => {
    const eventInfo = getRandomEventInfo()
    const id = await newEventPage.actionCreateEvent(eventInfo)

    const eventPage = new EventPage(page, id)
    await eventPage.goto()
    await eventPage.verifyEventInfo(eventInfo)

    await eventPage.actionDeleteEvent()
  })

  test('should have widgets', async ({ newEventPage, page }) => {
    const eventInfo = getRandomEventInfo({
      time: {
        hours: 12,
        minutes: 5,
      },
    })
    const id = await newEventPage.actionCreateEvent(eventInfo)

    const eventPage = new EventPage(page, id)
    await eventPage.goto()

    const breadcrumbs = page
      .locator('div')
      .filter({ hasText: new RegExp(`^Tapahtumat\\/${eventInfo.title}$`) })
      .getByRole('paragraph')

    await expect(breadcrumbs).toBeVisible()
    await expect(page.getByText(`Modification zone`)).toBeVisible()
    await expect(eventPage.getModifyEventBtn()).toBeEnabled()
    await expect(eventPage.getDeleteEventBtn()).toBeEnabled()

    await eventPage.actionDeleteEvent()
  })

  test('should join event', async ({ newEventPage, page }) => {
    const eventInfo = getRandomEventInfo()
    const id = await newEventPage.actionCreateEvent(eventInfo)

    const eventPage = new EventPage(page, id)
    await eventPage.goto()

    const noParticipantsText = 'Tapahtumassa ei osallistujia'

    await expect(page.getByText(noParticipantsText)).toBeVisible()
    await eventPage.clickButton('Osallistu')
    await eventPage.expectParticipantCount(1)
    await expect(
      newEventPage.getParticipants().getByText(testUser.nick)
    ).toBeVisible()
    await expect(page.getByText(noParticipantsText)).not.toBeVisible()

    await eventPage.clickButton('Poistu')
    await eventPage.expectParticipantCount(0)
    await expect(page.getByText(noParticipantsText)).toBeVisible()

    await eventPage.actionDeleteEvent()
  })
})
