/// <reference types="cypress" />

Cypress.Commands.add('login', (user: LoginUser) => {
  cy.session(
    user.email,
    () => {
      cy.visit('/login')
      cy.get('input[name=email]').type(user.email)
      cy.get('input[name=password]').type(user.password)
      cy.get('form').contains('Kirjaudu').click()
      cy.url().should('include', '/events')
      cy.get('header').contains(user.nick)
    },
    {
      validate: () => {
        cy.getCookie('__session').should('exist')
      },
    }
  )
})

Cypress.Commands.add('loginWithDefaultUser', () => {
  cy.session(
    Cypress.env('USER_EMAIL'),
    () => {
      cy.visit('/login')
      cy.get('input[name=email]').type(Cypress.env('USER_EMAIL'))
      cy.get('input[name=password]').type(Cypress.env('USER_PASSWORD'))
      cy.get('form').contains('Kirjaudu').click()
      cy.url().should('include', '/events')
      cy.get('header').contains(Cypress.env('USER_NICK'))
    },
    {
      validate: () => {
        cy.getCookie('__session').should('exist')
      },
      cacheAcrossSpecs: true,
    }
  )
})

Cypress.Commands.add('getByDataCy', (dataCyName: string) => {
  cy.get(`[data-cy="${dataCyName}"]`)
})

type LoginUser = {
  email: string
  password: string
  nick: string
}
