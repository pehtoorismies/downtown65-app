import type { ActionFunction } from '@remix-run/node'
// import { json } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'

export interface ActionData {}

export const action: ActionFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/auth/login')
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

  const headers = result.headers ?? {}

  return json<ActionData>({}, { headers })
}
