import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import { createUserSession, Tokens } from '~/session.server'
import { validateEmail } from '~/util/validation.server'

export interface ActionData {
  emailError?: string
  passwordError?: string
  generalError?: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { emailError: 'Väärä sähköpostiosoite' },
      { status: 400 }
    )
  }

  if (typeof password !== 'string') {
    return json<ActionData>(
      { passwordError: 'Salasana tarvitaan' },
      { status: 400 }
    )
  }

  try {
    const { login } = await getGqlSdk().Login(
      { email, password },
      getPublicAuthHeaders()
    )

    if (login.loginError && login.loginError.code === 'invalid_grant') {
      return json<ActionData>(
        { generalError: 'Email or password is invalid' },
        { status: 400 }
      )
      return json<ActionData>(
        { generalError: login.loginError?.message },
        { status: 400 }
      )
    }

    const tokens = Tokens.parse(login.tokens)

    return createUserSession({
      request,
      tokens,
      redirectTo: '/events',
    })
  } catch (error) {
    console.error(error)
    return json<ActionData>({ generalError: 'Server error' }, { status: 500 })
  }
}
