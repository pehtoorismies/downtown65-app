import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { logout, validateSessionUser } from '~/session.server'
// TODO: add error handling

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const userSession = await validateSessionUser(request)

  if (!userSession.valid) {
    return logout(request)
  }

  const body = await request.formData()
  const action = body.get('action')

  switch (action) {
    case 'delete': {
      // TODO: add error handling
      await getGqlSdk().DeleteEvent(
        {
          eventId: params.id,
        },
        {
          Authorization: `Bearer ${userSession.accessToken}`,
        }
      )
      const session = await getSession(request.headers.get('cookie'))
      setSuccessMessage(session, 'Tapahtuma on poistettu')

      const headers = userSession.headers
      headers.append('Set-Cookie', await commitSession(session))

      return redirect('/events', {
        headers,
      })
    }
    case 'participate': {
      await getGqlSdk().ParticipateEvent(
        {
          eventId: params.id,
          me: userSession.user,
        },
        {
          Authorization: `Bearer ${userSession.accessToken}`,
        }
      )
      return json({}, { headers: userSession.headers })
    }
    case 'leave': {
      await getGqlSdk().LeaveEvent(
        {
          eventId: params.id,
        },
        {
          Authorization: `Bearer ${userSession.accessToken}`,
        }
      )
      return json({}, { headers: userSession.headers })
    }
  }

  throw new Error(
    `Incorrect action provided: '${action}'. Use 'leave' or 'participate'`
  )
}
