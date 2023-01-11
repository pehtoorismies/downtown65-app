describe('Logged out user', () => {
  it('navigation', () => {
    cy.visit('/login')
    cy.get('h1').contains('Kirjaudu')
    cy.get('main').contains('Rekisteröidy tästä').click({ force: true })
    cy.get('h1').contains('Rekisteröidy')
    cy.get('main').contains('Kirjautumiseen').click({ force: true })
    cy.get('main').contains('Unohditko salasanan?').click({ force: true })
    cy.get('h1').contains('Salasana unohtunut')
    cy.get('main').contains('Kirjautumiseen').click({ force: true })
    cy.get('h1').contains('Kirjaudu')
    cy.get('nav').contains('Rekisteröidy').click({ force: true })
    cy.get('h1').contains('Rekisteröidy')
    cy.get('nav').contains('Kirjaudu').click({ force: true })
    cy.get('h1').contains('Kirjaudu')
  })

  it('login failure', () => {
    cy.visit('/login')
    cy.get('input[name=email]').type('someone@example.com')
    cy.get('input[name=password]').type('somepassword')
    cy.get('form').contains('Kirjaudu').click()
    cy.contains('Virhe kirjautumisessa')
  })

  it('login and logout success', () => {
    cy.login({
      email: Cypress.env('USER_EMAIL'),
      password: Cypress.env('USER_PASSWORD'),
      nick: Cypress.env('USER_NICK'),
    })
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
})
