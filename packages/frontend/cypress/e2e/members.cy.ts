describe('Members', () => {
  it('should have some members', () => {
    cy.loginWithDefaultUser()
    cy.visit('/events')
    cy.get('header').contains('Jäsenet').click({ force: true })
    cy.contains('Seuran jäsenet')
    cy.contains('Jäseniä yhteensä')
  })
})
