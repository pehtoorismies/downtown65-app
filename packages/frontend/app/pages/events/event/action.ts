import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { validateSessionUser } from '~/session.server'

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
  }
  const body = await request.formData()
  const action = body.get('action')

  switch (action) {
    case 'participate': {
      await getGqlSdk().ParticipateEvent(
        {
          eventId: params.id,
          me: result.user,
        },
        {
          Authorization: `Bearer ${result.accessToken}`,
        }
      )
      return json({})
    }
    case 'leave': {
      {
        await getGqlSdk().LeaveEvent(
          {
            eventId: params.id,
          },
          {
            Authorization: `Bearer ${result.accessToken}`,
          }
        )
      }
      return json({})
    }
  }

  throw new Error(
    `Incorrect action provided: '${action}'. Use 'leave' or 'participate'`
  )
}
