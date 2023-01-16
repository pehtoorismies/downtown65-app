/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(user: LoginUser): Chainable<void>

    loginWithDefaultUser(): Chainable<void>

    getByDataCy(dataCyName: string): Chainable<void>

    createEvent(eventBasicInfo: EventBasicInfo)
  }
}
