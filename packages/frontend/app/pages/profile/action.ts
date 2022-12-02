import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { validateSessionUser } from '~/session.server'

interface ActionData {}

export const action: ActionFunction = async ({ request }) => {
  const userSession = await validateSessionUser(request)
  if (!userSession.valid) {
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
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )
  const messageSession = await getSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Asetukset on päivitetty')

  const headers = userSession.headers
  headers.append('Set-Cookie', await commitSession(messageSession))

  return json<ActionData>(
    {},
    {
      headers,
    }
  )
}
