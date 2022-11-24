import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { getEventForm } from '~/pages/events/support/get-event-form'
import { validateSessionUser } from '~/session.server'

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
  }

  const { id: eventId } = params

  const body = await request.formData()

  const { description, location, isRace, subtitle, title, type, time, date } =
    getEventForm(body)

  await getGqlSdk().UpdateEvent(
    {
      eventId,
      input: {
        dateStart: date,
        description: description.trim() === '' ? undefined : description,
        location,
        race: isRace,
        subtitle,
        timeStart: time,
        title,
        type,
      },
    },
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(session, 'Tapahtuman muokkaus onnistui')
  return redirect(`/events/${eventId}`, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
