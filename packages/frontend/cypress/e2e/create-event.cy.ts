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
})
