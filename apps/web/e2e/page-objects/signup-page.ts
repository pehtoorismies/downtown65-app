import type { Page } from '@playwright/test'

export class SignupPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async submitLogin({
    email,
    password,
    name,
    registerSecret,
    nick,
  }: {
    email: string
    password: string
    name: string
    nick: string
    registerSecret: string
  }) {
    await this.getEmail().fill(email)
    await this.getPassword().fill(password)
    await this.getName().fill(name)
    await this.getNickname().fill(nick)
    await this.getRegisterSecret().fill(registerSecret)
    await this.page.getByTestId('submit-signup').click()
  }

  getPassword() {
    return this.page.getByRole('textbox', { name: 'Salasana' })
  }

  getEmail() {
    return this.page.getByRole('textbox', { name: 'Sähköposti' })
  }

  getName() {
    return this.page.getByRole('textbox', { name: 'Nimi' })
  }

  getNickname() {
    return this.page.getByRole('textbox', { name: 'Nickname' })
  }

  getRegisterSecret() {
    return this.page.getByRole('textbox', { name: 'Rekisteröintitunnus' })
  }
}
