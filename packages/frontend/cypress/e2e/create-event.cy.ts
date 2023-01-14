import { randSports, randProductName, randCity } from '@ngneat/falso'

describe('Create event', () => {
  beforeEach(() => {
    cy.loginWithDefaultUser()
    cy.visit('/events')
    cy.getByDataCy('nav-create-new-event').click()
  })

  it('should cancel new event creation', () => {
    cy.getByDataCy('cancel-event-creation-button').as('cancel')

    cy.get('@cancel').click()
    cy.get(`[aria-label="Close"]`).click()
    cy.getByDataCy('confirmation-modal').should('not.exist')

    cy.getByDataCy('button-MEETING').click()
    cy.get('@cancel').click()
    cy.getByDataCy('modal-close').click()
    cy.getByDataCy('confirmation-modal').should('not.exist')

    cy.get('@cancel').click()
    // click outside modal
    cy.get('body').click(0, 0)
    cy.getByDataCy('confirmation-modal').should('not.exist')

    cy.get('@cancel').click()
    cy.getByDataCy('modal-cancel-event-creation').click()
    cy.location('pathname').should('equal', '/events')
  })

  it.only('should create a new event', () => {
    const title = randSports()
    const subtitle = randProductName()
    const location = randCity()
    const userNick = Cypress.env('USER_NICK')

    cy.getByDataCy('prev-button').should('not.exist')
    cy.getByDataCy('next-button').should('not.exist')
    cy.getByDataCy('skip-step-button').as('skipBtn')

    // step type
    cy.get('@skipBtn').should('be.disabled')
    // clicking should not do anything
    cy.getByDataCy('step-preview').click()
    cy.getByDataCy('button-MEETING').click()
    cy.getByDataCy('next-button').should('not.exist')
    cy.getByDataCy('prev-button').as('prev').click()
    cy.getByDataCy('button-MEETING-selected').should('exist')
    cy.getByDataCy('button-CYCLING').click()
    cy.getByDataCy('button-CYCLING-selected').should('exist')
    cy.getByDataCy('next-button').as('next').click()

    // step basic info
    cy.get('@next').should('not.exist')
    cy.get('@skipBtn').should('be.disabled')
    // clicking should not do anything
    cy.getByDataCy('step-description').click()
    cy.get('input[name=title]').type(title)
    cy.get('@next').should('not.exist')
    cy.get('input[name=subtitle]').type(subtitle)
    cy.get('@next').should('not.exist')
    cy.get('input[name=location]').type(location)
    cy.get('@next').should('exist')
    cy.getByDataCy('race-switch').parent().click()
    cy.get('button[data-completed="true"]').as('completed')
    cy.get('@completed').should('have.length', 1)
    cy.get('@next').click()

    // step date
    cy.get('@skipBtn').should('be.disabled')
    cy.get('@completed').should('have.length', 2)
    cy.get('button[data-selected="true"]').contains(new Date().getDate())
    cy.getByDataCy('step-preview').click()
    cy.contains('Esikatselu')
    cy.getByDataCy('step-date').click()
    cy.get('@next').click()

    // step time
    cy.get('@completed').should('have.length', 3)
    cy.get('@skipBtn').click()
    cy.get('h1').contains('Vapaa kuvaus')
    cy.get('@prev').click()
    cy.get('h1').contains('Kellonaika')
    cy.contains('ei aikaa')
    cy.contains('14').click()
    cy.contains('14:xx')
    cy.getByDataCy('clear-time').click()
    cy.contains('ei aikaa')
    cy.contains('14').click()
    cy.contains('55').click()
    cy.contains('14:55')
    cy.get('@next').click()

    // step description
    cy.get('@completed').should('have.length', 4)
    cy.get('@skipBtn').should('not.be.disabled')
    // TODO: add some text description
    cy.get('@next').click()

    // step preview
    cy.get('@completed').should('have.length', 5)
    cy.get('h1').contains('Esikatselu')
    cy.get('@skipBtn').should('be.disabled')

    cy.getByDataCy('event-race')
    cy.getByDataCy('event-title').contains(title)
    cy.getByDataCy('event-subtitle').contains(subtitle)
    cy.getByDataCy('event-location').contains(location)
    cy.getByDataCy('event-date').contains('14:55')

    cy.getByDataCy('event-participant-count').contains('0')
    cy.getByDataCy('participate').click()
    cy.getByDataCy('event-participant-count').contains('1')
    cy.getByDataCy('event-participant').should('have.length', 1)
    cy.getByDataCy('event-participant').first().contains(userNick)
    cy.getByDataCy('leave').click()
    cy.getByDataCy('event-participant-count').contains('0')
    cy.getByDataCy('created-by').contains(userNick)
    cy.getByDataCy('participate').click()

    // click through steps
    cy.getByDataCy('step-type').click()
    cy.get('h1').contains('Laji')

    cy.getByDataCy('step-basic-info').click()
    cy.get('h1').contains('Perustiedot')

    cy.getByDataCy('step-date').click()
    cy.get('h1').contains('Päivämäärä')

    cy.getByDataCy('step-time').click()
    cy.get('h1').contains('Kellonaika')

    cy.getByDataCy('step-description').click()
    cy.get('h1').contains('Vapaa kuvaus')

    cy.getByDataCy('step-preview').click()
    cy.get('h1').contains('Esikatselu')

    // create event
    cy.get('@next').click()

    // verify event
    cy.location('pathname').should('not.equal', '/events/new')
    cy.getByDataCy('event-race')
    cy.getByDataCy('event-title').contains(title)
    cy.getByDataCy('event-subtitle').contains(subtitle)
    cy.getByDataCy('event-location').contains(location)
    cy.getByDataCy('event-date').contains('14:55')
    cy.getByDataCy('event-participant').first().contains(userNick)
    cy.getByDataCy('event-participant-count').contains('1')
    cy.getByDataCy('leave').click()
    cy.getByDataCy('event-participant-count').contains('0')
    cy.getByDataCy('participate').click()
  })
})
