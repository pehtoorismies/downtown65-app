import { toISOTime } from '@downtown65-app/core/time-functions'
import { test as base, expect } from '@playwright/test'
import invariant from 'tiny-invariant'
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

test.describe('Edit event', () => {
  test('should edit event page', async ({ page, newEventPage }) => {
    const eventInfo = getRandomEventInfo()
    const {
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
    } = getRandomEventInfo()
    const id = await newEventPage.actionCreateEvent(eventInfo)

    const eventPage = new EventPage(page, id)
    await eventPage.goto()

    // TODO: edit page / new page
    await newEventPage.getModifyEventBtn().click()
    await page.waitForURL(/\/events\/edit/)
    await newEventPage.headerVisible('Laji')

    await newEventPage.clickButton('Perustiedot')
    await newEventPage.getInputTitle().clear()
    await newEventPage.clickButton('Päivämäärä')
    await expect(page.getByText('Nimi ei voi olla tyhjä')).toBeVisible()
    await newEventPage.getInputTitle().clear()
    await newEventPage.getInputSubtitle().clear()
    await newEventPage.getInputLocation().clear()

    await newEventPage.fillEventInfo({
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
    })
    await newEventPage.stepBtnClick('preview')
    await newEventPage.headerVisible('Perustiedot')

    await newEventPage.clickButton('Päivämäärä')
    await newEventPage.clickButton('Kellonaika')

    invariant(eventInfo.time)
    const isoTime = toISOTime(eventInfo.time)
    invariant(isoTime.success)
    await newEventPage.headerVisible(`Kellonaika: ${isoTime.data}`)

    await newEventPage.clickButton('Tyhjennä aika')

    const heading = await newEventPage.getStepHeading().textContent()
    expect(heading).toMatch(/^Kellonaika$/)

    await newEventPage.clickButton('Kuvaus')
    await newEventPage.clickButton('Esikatselu')

    await newEventPage.verifyEventInfo({
      ...eventInfo,
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
      time: null,
    })

    await newEventPage.clickButton('Tallenna')

    await page.waitForURL(new RegExp(`events/${id}$`))

    await newEventPage.verifyEventInfo({
      ...eventInfo,
      title: updatedTitle,
      subtitle: updatedSubtitle,
      location: updatedLocation,
      time: null,
    })
  })
})