import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { validateSessionUser } from '~/session.server'

interface ActionData {}

export const action: ActionFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const weekly = !!formData.get('weekly')
  const eventCreated = !!formData.get('eventCreated')

  await getGqlSdk().UpdateMe(
    {
      subscribeEventCreationEmail: eventCreated,
      subscribeWeeklyEmail: weekly,
    },
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )
  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(session, 'Asetukset on päivitetty')
  // const headers = result.headers ?? {} // TODO: how to combine these headers

  return json<ActionData>(
    {},
    {
      headers: { 'Set-Cookie': await commitSession(session) },
    }
  )
}
