import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { graphql } from '~/generated/gql'
import { LeaveEventDocument } from '~/generated/graphql'
import { gqlClient } from '~/gql/get-gql-client.server'
import { actionAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  mutation LeaveEvent($eventId: ID!) {
    leaveEvent(eventId: $eventId)
  }
`)

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const { headers, accessToken } = await actionAuthenticate(request)

  if (request.method !== 'PUT') {
    throw new Error(`Unsupported request method ${request.method}`)
  }

  await gqlClient.request(
    LeaveEventDocument,
    {
      eventId: params.id,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  )
  return json({}, { headers })
}
