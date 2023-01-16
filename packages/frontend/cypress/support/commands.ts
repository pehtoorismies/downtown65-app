/// <reference types="cypress" />

type LoginUser = {
  email: string
  password: string
  nick: string
}

Cypress.Commands.add('login', (user: LoginUser) => {
  cy.session(
    user.email,
    () => {
      cy.visit('/login')
      cy.get('h1').contains('Kirjaudu')
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
      cy.get('h1').contains('Kirjaudu')
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

type EventBasicInfo = {
  title: string
  subtitle: string
  location: string
}

Cypress.Commands.add(
  'createEvent',
  ({ title, subtitle, location }: EventBasicInfo) => {
    cy.visit('/events/new')
    cy.getByDataCy('button-CYCLING').click()
    cy.get('h1').contains('Perustiedot')
    cy.get('input[name=title]').type(title)
    cy.get('input[name=subtitle]').type(subtitle)
    cy.get('input[name=location]').type(location)
    cy.getByDataCy('next-button').as('next').click()
    cy.getByDataCy('step-preview').click()
    cy.get('@next').click()
  }
)
