import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { validateEmail } from '~/util/validation.server'

export interface ActionData {
  error: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { error: 'Väärän muotoinen sähköpostiosoite' },
      { status: 400 }
    )
  }

  await getGqlSdk().ForgotPassword({ email }, getPublicAuthHeaders())

  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(session, `Ohjeet lähetetty osoitteeseen: ${email}`)
  return redirect('/login', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
