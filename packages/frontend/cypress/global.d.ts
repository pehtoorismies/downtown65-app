/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(user: LoginUser): Chainable<void>
  }
}
