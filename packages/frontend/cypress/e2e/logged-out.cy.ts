import { randCity, randProductName, randSports } from '@ngneat/falso'

describe('Logged out user', () => {
  it('navigation', () => {
    cy.visit('/login')
    cy.get('h1').contains('Kirjaudu')

    // cypress can't click element if not forced
    // some hydration issue?
    // see also ./support/e2e.ts error handling <= remix mantine combo related issue perhaps
    cy.get('[data-cy="to-signup"]').click({ force: true })

    cy.get('h1').contains('Rekisteröidy')
    cy.get('[data-cy="to-login"]').click({ force: true })

    cy.get('h1').contains('Kirjaudu')
    cy.get('[data-cy="to-forgot-password"]').click({ force: true })

    cy.get('h1').contains('Salasana unohtunut')
    cy.get('[data-cy="to-login"]').click({ force: true })

    cy.get('h1').contains('Kirjaudu')
    cy.get('[data-cy="button-to-signup"]').click({ force: true })

    cy.get('h1').contains('Rekisteröidy')
    cy.get('[data-cy="button-to-login"]').click({ force: true })

    cy.get('h1').contains('Kirjaudu')
  })

  it('login failure', () => {
    cy.visit('/login')
    cy.get('input[name=email]').type('someone@example.com')
    cy.get('input[name=password]').type('somepassword')
    cy.get('form').contains('Kirjaudu').click({ force: true })
    cy.contains('Virhe kirjautumisessa')
  })

  it('login and logout success', () => {
    cy.loginWithDefaultUser()
    cy.visit('/events')
    cy.get('header').contains(Cypress.env('USER_NICK')).click() // username dropdown
    cy.get('header').contains('Logout').click()
    cy.get('h1').contains('Kirjaudu')
  })

  it('forgot password', () => {
    cy.visit('/forgot-password')
    cy.get('input[name=email]').type('someone@example.com')
    cy.log('Forgot password')
  })

  it('can see event', () => {
    const eventBasicInfo = {
      title: randSports(),
      subtitle: randProductName(),
      location: randCity(),
    }
    cy.loginWithDefaultUser()
    cy.createEvent(eventBasicInfo)

    cy.location('pathname').should('not.eq', '/events/new')

    cy.location('pathname').then(($path) => {
      cy.get('header').contains(Cypress.env('USER_NICK')).click() // username dropdown
      cy.get('header').contains('Profiili').click()
      cy.getByDataCy('profile-logout').click()
      cy.location('pathname').should('eq', '/login')
      cy.visit($path)
      cy.getByDataCy('event-race').should('not.exist')
      cy.getByDataCy('event-title').contains(eventBasicInfo.title)
      cy.getByDataCy('event-subtitle').contains(eventBasicInfo.subtitle)
      cy.getByDataCy('event-location').contains(eventBasicInfo.location)
      cy.getByDataCy('event-participant-count').contains('0')

      cy.get('head meta[property="og:title"]')
        .invoke('attr', 'contain')
        .should('equal')

      cy.getByDataCy('leave').should('not.exist')
      cy.getByDataCy('participate').should('not.exist')
      cy.getByDataCy('event-goto-login').click({ force: true })
      cy.location('pathname').should('eq', '/login')
    })
  })

  it('should deny access and redirect to login', () => {
    cy.visit('/members')
    cy.location('pathname').should('eq', '/login')
    cy.visit('/events')
    cy.location('pathname').should('eq', '/login')
    cy.visit('/profile')
    cy.location('pathname').should('eq', '/login')
    cy.visit('/events/new')
    cy.location('pathname').should('eq', '/login')
  })

  it('should show not found', () => {
    cy.visit('/some-page-that-does-not-exist')
    cy.get('h1').contains('PUMMI')
    cy.getByDataCy('navigate-home').click({ force: true })
    cy.location('pathname').should('eq', '/login')
  })
})
