import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import formatISO from 'date-fns/formatISO'
import { getPrimaryKey } from '../../core/event-primary-key'
import { isAWSError } from './support/aws-error'
import type { MutationJoinEventArgs } from '~/appsync.gen'
import { getTable } from '~/dynamo/table'

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
  boolean | undefined
> = async (event) => {
  const eventId = event.arguments.eventId
  const identity = event.identity as AppSyncIdentityOIDC

  const claims = identity.claims as Claims

  const nickname = claims['https://graphql.downtown65.com/nickname']

  const Table = getTable()

  try {
    await Table.transactWrite(
      [
        Table.Participant.putTransaction({
          PK: `EVENT#${eventId}`,
          SK: `USER#${nickname}`,
          nickname,
          GSI2PK: `USER#${nickname}`,
          GSI2SK: `EVENT#${eventId}`,
        }),
        Table.Dt65Event.updateTransaction(
          {
            ...getPrimaryKey(eventId),
            participants: {
              $set: {
                [nickname]: formatISO(new Date()),
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

    return true
  } catch (error: unknown) {
    console.error(error)
    if (isAWSError(error) && error.name === 'ConditionalCheckFailedException') {
      throw new Error('Event not found (ConditionalCheckFailedException)')
    }
    //

    throw new Error('Something went wrong')
  }
}
