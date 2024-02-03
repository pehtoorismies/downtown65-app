import type { Page } from '@playwright/test'
import { CreatableEvent } from './compositions/creatable-event'
import { EventWizard } from './compositions/event-wizard'
import { General } from './compositions/general'
import { ViewableEvent } from './compositions/viewable-event'

export class EventPage {
  page: Page
  wizard: EventWizard
  create: CreatableEvent
  view: ViewableEvent
  general: General

  constructor(page: Page) {
    this.page = page
    this.wizard = new EventWizard(page)
    this.create = new CreatableEvent(page)
    this.view = new ViewableEvent(page)
    this.general = new General(page)
  }
}
