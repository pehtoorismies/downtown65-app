import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { graphql } from '~/generated/gql'
import { ParticipateEventDocument } from '~/generated/graphql'
import { gqlClient } from '~/gql/get-gql-client.server'
import { actionAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {
    participateEvent(eventId: $eventId, me: $me)
  }
`)

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const { headers, user, accessToken } = await actionAuthenticate(request)

  if (request.method !== 'PUT') {
    throw new Error(`Unsupported request method ${request.method}`)
  }

  await gqlClient.request(
    ParticipateEventDocument,
    {
      eventId: params.id,
      me: user,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  return json({}, { headers })
}
