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

type LoginUser = {
  email: string
  password: string
  nick: string
}
