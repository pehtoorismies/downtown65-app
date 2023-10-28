import { expect, test } from '@playwright/test'
import { SignupPage } from './page-objects/signup-page'
import { testUser } from './test-user'

const userInput = {
  ...testUser,
  name: 'Kissa Mies',
}

test.describe('Signup page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/signup')
  })

  test('should warn for short password', async ({ page }) => {
    const signup = new SignupPage(page)
    await signup.submitLogin({
      ...userInput,
      password: '123',
      registerSecret: 'wrongSecret',
    })

    await expect(page.getByText('Password too short')).toBeVisible()
    await expect(page.getByText('Wrong register secret')).toBeVisible()
  })

  test('should warn for existing email and nick', async ({ page }) => {
    const signup = new SignupPage(page)
    await signup.submitLogin({
      ...userInput,
    })

    await expect(page.getByText('Email already exists')).toBeVisible()
    await expect(page.getByText('Nickname already exists')).toBeVisible()
  })

  test('should warn for whitespace characters in nick', async ({ page }) => {
    const signup = new SignupPage(page)
    await signup.submitLogin({
      ...userInput,
      nick: `${testUser.nick} `,
    })

    await expect(page.getByText(' White space characters.')).toBeVisible()
  })

  test.describe('should warn for white space when', () => {
    test('space char before name', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        name: ' Kissa Koira',
      })
      await expect(page.getByText(' White space characters.')).toBeVisible()
    })

    test('space char after name', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        name: 'Kissa Koira ',
      })
      await expect(page.getByText(' White space characters.')).toBeVisible()
    })

    test('multiple space char between name', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        name: 'Kissa  Koira',
      })
      await expect(page.getByText('White space characters.')).toBeVisible()
    })

    test('space char before nick', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        nick: ' someNick',
      })
      await expect(page.getByText('White space characters.')).toBeVisible()
    })

    test('space char after nick', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        nick: 'someNick ',
      })
      await expect(page.getByText('White space characters.')).toBeVisible()
    })

    test('space char in nick', async ({ page }) => {
      const signup = new SignupPage(page)
      await signup.submitLogin({
        ...userInput,
        nick: 'my nick',
      })
      await expect(page.getByText('White space characters.')).toBeVisible()
    })
  })
})
