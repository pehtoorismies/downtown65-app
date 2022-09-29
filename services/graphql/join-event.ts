import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import formatISO from 'date-fns/formatISO'
import type { MutationJoinEventArgs, Event as Dt65Event } from '../appsync'
import { getTable } from '../functions/db/table'

import { getPrimaryKey } from '../functions/events/support/event-primary-key'

import { isAWSError } from '../functions/support/aws-error'

type Claims = {
  sub: string
  aud: string[]
  azp: string
  scope: string
  iss: string
  ['https://graphql.downtown65.com/nickname']: string
  exp: number
  iat: number
  gty: string
}

export const joinEvent: AppSyncResolverHandler<
  MutationJoinEventArgs,
  Dt65Event | undefined
> = async (event) => {
  const eventId = event.arguments.eventId
  const identity = event.identity as AppSyncIdentityOIDC

  const claims = identity.claims as Claims

  const nick = claims['https://graphql.downtown65.com/nickname']

  const Table = getTable()

  try {
    const result = await Table.transactWrite(
      [
        Table.Participant.putTransaction({
          PK: `EVENT#${eventId}`,
          SK: `USER#${nick}`,
          nick,
          GSI2PK: `USER#${nick}`,
          GSI2SK: `EVENT#${eventId}`,
        }),
        Table.Dt65Event.updateTransaction(
          {
            ...getPrimaryKey(eventId),
            participants: {
              $set: {
                [nick]: formatISO(new Date()),
              },
            },
          },
          { conditions: { attr: 'title', exists: true } }
        ),
      ],
      {
        capacity: 'total',
        metrics: 'size',
      }
    )
    console.log(result)

    return void 0
  } catch (error: unknown) {
    console.error(error)
    if (isAWSError(error) && error.name === 'ConditionalCheckFailedException') {
      throw new Error('Event not found (ConditionalCheckFailedException)')
    }
    //

    throw new Error('Something went wrong')
  }
}
