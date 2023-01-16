describe('User profile', () => {
  beforeEach(() => {
    cy.loginWithDefaultUser()
    cy.visit('/profile')
  })

  it('should contain user info', () => {
    const nick = Cypress.env('USER_NICK')
    const email = Cypress.env('USER_EMAIL')

    cy.getByDataCy('profile-nick').contains(nick)
    cy.getByDataCy('profile-email').contains(email)
  })
})
