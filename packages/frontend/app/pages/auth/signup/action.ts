import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import type { SignupField, SignupPayload } from '~/gql/types.gen'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'

const SignupForm = z.object({
  email: z.string(),
  name: z.string(),
  nickname: z.string(),
  password: z.string(),
  registerSecret: z.string(),
})

export interface ActionData {
  errors?: Partial<Record<SignupField, string>>
}

const toActionData = (
  errors: NonNullable<SignupPayload['errors']>
): ActionData => {
  return {
    errors: Object.fromEntries(errors.map((t) => [t.path, t.message])),
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const signupForm = SignupForm.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    nickname: formData.get('nickname'),
    registerSecret: formData.get('registerSecret'),
    name: formData.get('name'),
  })

  const { signup } = await getGqlSdk().Signup(
    signupForm,
    getPublicAuthHeaders()
  )

  if (signup.errors) {
    return json<ActionData>(toActionData(signup.errors), { status: 400 })
  }

  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(
    session,
    `Vahvistus lähetetty osoitteeseen: ${signupForm.email}`
  )
  return redirect('/auth/login', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
