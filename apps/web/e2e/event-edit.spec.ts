import { toISOTime } from '@downtown65-app/time'
import { test as base, expect } from '@playwright/test'
import invariant from 'tiny-invariant'
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

test.describe('Edit event', () => {
  test('should cancel event creation', async ({ page, eventPage }) => {
    const eventInfo = getRandomEventInfo()

    const id = await eventPage.wizard.actionCreateEvent(eventInfo)
    await eventPage.view.goto(id)
    await eventPage.view.getModifyEventBtn().click()

    await eventPage.wizard.headerVisible('Laji')

    await page.getByTestId('cancel-event-edit-button').click()
    await expect(eventPage.wizard.getCancelModalContent()).toBeVisible()
    // await newEventPage.cancelClick()
    await expect(page.getByText('Keskeytä tapahtuman muokkaus')).toBeVisible()
    await eventPage.wizard.modalClick('confirmCancel')
    await page.waitForURL(`events/${id}`)
    await expect(eventPage.view.getTitle()).toHaveText(eventInfo.title)
  })

  test('should edit event page', async ({ page, eventPage }) => {
    const eventInfo = getRandomEventInfo()
    const {
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
      date: updatedDate,
    } = getRandomEventInfo()
    const id = await eventPage.wizard.actionCreateEvent(eventInfo)
    await eventPage.view.goto(id)

    // TODO: edit page / new page
    await eventPage.view.getModifyEventBtn().click()
    await page.waitForURL(/\/events\/edit/)
    await eventPage.wizard.headerVisible('Laji')

    await eventPage.wizard.clickButton('Perustiedot')
    await eventPage.wizard.getInputTitle().clear()
    await eventPage.wizard.clickButton('Päivämäärä')
    await expect(page.getByText('Nimi ei voi olla tyhjä')).toBeVisible()
    await eventPage.wizard.getInputTitle().clear()
    await eventPage.wizard.getInputSubtitle().clear()
    await eventPage.wizard.getInputLocation().clear()

    await eventPage.wizard.fillEventInfo({
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
    })
    await eventPage.wizard.stepBtnClick('preview')
    await eventPage.wizard.headerVisible('Perustiedot')

    await eventPage.wizard.clickButton('Päivämäärä')
    await eventPage.wizard.headerVisible('Päivämäärä: ')

    await eventPage.wizard.selectDate(eventInfo.date, updatedDate)

    await eventPage.wizard.clickButton('Kellonaika')

    invariant(eventInfo.time)
    const isoTime = toISOTime(eventInfo.time)
    invariant(isoTime.success)
    await eventPage.wizard.headerVisible(`Kellonaika: ${isoTime.data}`)

    await eventPage.wizard.clickButton('Tyhjennä aika')

    const heading = await eventPage.wizard.getStepHeading().textContent()
    expect(heading).toMatch(/^Kellonaika$/)

    await eventPage.wizard.clickButton('Kuvaus')
    await eventPage.wizard.clickButton('Esikatselu')

    await eventPage.view.verifyEventInfo({
      ...eventInfo,
      title: updatedTitle,
      date: updatedDate,
      subtitle: updatedSubtitle,
      location: updatedLocation,
      time: null,
    })

    await eventPage.wizard.clickButton('Tallenna')

    await page.waitForURL(new RegExp(`events/${id}$`))

    await eventPage.view.verifyEventInfo({
      ...eventInfo,
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
      date: updatedDate,
      time: null,
    })
  })
})
