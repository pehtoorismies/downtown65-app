import { test as base, expect } from '@playwright/test'
import { EventPage } from './page-objects/event-page'
import { getRandomEventInfo } from './support/random-event'
import { testUser } from './test-user'

const test = base.extend<{ eventPage: EventPage }>({
  eventPage: async ({ page }, use) => {
    const createEventPage = new EventPage(page)
    await createEventPage.create.goto()
    await createEventPage.wizard.headerVisible('Laji')
    await use(createEventPage)
  },
})

test.describe('View event', () => {
  test('should not have time or description', async ({ eventPage }) => {
    const eventInfo = getRandomEventInfo({ time: null, description: '' })
    const id = await eventPage.wizard.actionCreateEvent(eventInfo)

    await eventPage.view.goto(id)
    await eventPage.view.verifyEventInfo(eventInfo)

    await eventPage.view.actionDeleteEvent()
  })

  test('should have no description', async ({ eventPage }) => {
    const eventInfo = getRandomEventInfo({ description: '' })
    const id = await eventPage.wizard.actionCreateEvent(eventInfo)
    await eventPage.view.goto(id)
    await eventPage.view.verifyEventInfo(eventInfo)

    await eventPage.view.actionDeleteEvent()
  })

  test('should have all fields', async ({ page, eventPage }) => {
    const eventInfo = getRandomEventInfo({
      time: {
        hours: 12,
        minutes: 5,
      },
    })
    const id = await eventPage.wizard.actionCreateEvent(eventInfo)

    await eventPage.view.goto(id)

    // TODO: put inside page object?
    const breadcrumbs = page
      .locator('div')
      .filter({ hasText: new RegExp(`^Tapahtumat\\/${eventInfo.title}$`) })
      .getByRole('paragraph')

    await expect(breadcrumbs).toBeVisible()
    await expect(page.getByText(`Modification zone`)).toBeVisible()
    await expect(eventPage.view.getModifyEventBtn()).toBeEnabled()
    await expect(eventPage.view.getDeleteEventBtn()).toBeEnabled()

    await eventPage.view.actionDeleteEvent()
  })

  test('should join event', async ({ page, eventPage }) => {
    const eventInfo = getRandomEventInfo()
    const id = await eventPage.wizard.actionCreateEvent(eventInfo)
    await eventPage.view.goto(id)

    const noParticipantsText = 'Tapahtumassa ei osallistujia'

    await expect(page.getByText(noParticipantsText)).toBeVisible()
    await eventPage.general.clickButton('Osallistu')
    await eventPage.view.expectParticipantCount(1)
    await expect(
      eventPage.view.getParticipants().getByText(testUser.nick)
    ).toBeVisible()
    await expect(page.getByText(noParticipantsText)).not.toBeVisible()

    await eventPage.general.clickButton('Poistu')
    await eventPage.view.expectParticipantCount(0)
    await expect(page.getByText(noParticipantsText)).toBeVisible()

    await eventPage.view.actionDeleteEvent()
  })
})
