import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { getEventForm } from '~/pages/events/support/get-event-form'
import { logout, validateSessionUser } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
  const userSession = await validateSessionUser(request)

  if (!userSession.valid) {
    return logout(request)
  }

  const body = await request.formData()

  const {
    description,
    location,
    isRace,
    subtitle,
    title,
    type,
    time,
    date,
    participants,
  } = getEventForm(body)

  const { createEvent } = await getGqlSdk().CreateEvent(
    {
      input: {
        createdBy: userSession.user,
        dateStart: date,
        description: description.trim() === '' ? undefined : description,
        location,
        race: isRace,
        subtitle,
        timeStart: time,
        title,
        type,
        participants,
      },
    },
    {
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )

  const messageSession = await getSession(request.headers.get('cookie'))

  setSuccessMessage(messageSession, 'Tapahtuman luonti onnistui')
  const headers = userSession.headers
  headers.append('Set-Cookie', await commitSession(messageSession))

  return redirect(`/events/${createEvent.id}`, {
    headers,
  })
}
