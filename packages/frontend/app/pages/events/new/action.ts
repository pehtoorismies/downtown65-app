import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { getEventForm } from '~/pages/events/support/get-event-form'
import { validateSessionUser } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
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
        createdBy: result.user,
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
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(session, 'Tapahtuman luonti onnistui')
  return redirect(`/events/${createEvent.id}`, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
