import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import { logger } from '@downtown65-app/core/logger/logger'
import type {
  Challenge,
  CreateChallengeInput,
  QueryChallengesArgs,
} from '@downtown65-app/graphql/graphql'
import * as R from 'remeda'
import { ulid } from 'ulid'
import {
  getParticipationFunctions,
  participantHashMapToList,
} from '~/gql/core/common'
import {
  ChallengeAccomplishmentSchema,
  ChallengeCreateSchema,
  ChallengeGetSchema,
} from '~/gql/core/dynamo-schemas/challenge-schema'
import { Auth0UserSchema } from '~/gql/core/dynamo-schemas/common'
import {
  ChallengeAccomplishment,
  ChallengeEntity,
  EntityNames,
} from '~/gql/core/dynamo-table'

const getChallengePrimaryKey = (id: string) => {
  return {
    PK: `CHALLENGE#${id}`,
    SK: `CHALLENGE#${id}`,
  }
}

export const create = async (
  creatable: CreateChallengeInput
): Promise<string> => {
  const { createdBy, dateStart, dateEnd, description, subtitle, title } =
    creatable
  const id = ulid()

  const start = DynamoDatetime.fromComponents(dateStart)
  const end = DynamoDatetime.fromComponents(dateEnd)

  const gsi1sk = end.getISODate()

  await ChallengeEntity.put(
    ChallengeCreateSchema.parse({
      // add keys
      ...getChallengePrimaryKey(id),
      GSI1PK: `CHALLENGE#CHALLENGE`,
      GSI1SK: `DATE#${gsi1sk}#${id.slice(0, 8)}`,
      // add props
      createdBy,
      // TODO: add creator
      participants: {},
      dateStart: start.getISODate(),
      dateEnd: end.getISODate(),
      description,
      id,
      subtitle,
      title,
    }),
    { returnValues: 'NONE' }
  )

  return id
}

export const getById = async (id: string): Promise<Challenge | null> => {
  const result = await ChallengeEntity.table?.query(`CHALLENGE#${id}`)

  if (!result?.Items) {
    return null
  }

  const groups = R.groupBy(result.Items ?? [], (x) => x.entity)

  const dynamoChallenge = R.first(groups[EntityNames.ChallengeEntity])
  if (!dynamoChallenge) {
    logger.error(
      { challengeId: id },
      'Challenge found, but entity type Challenge is missing'
    )
    return null
  }

  const dynamoAccomplishments =
    groups[EntityNames.ChallengeAccomplishment] ?? []

  const challenge = ChallengeGetSchema.parse(dynamoChallenge)
  const accomplishments = dynamoAccomplishments.map((x) => {
    return ChallengeAccomplishmentSchema.parse(x)
  })

  const participants = participantHashMapToList(challenge.participants).map(
    (p) => {
      const match = accomplishments.find(({ userId }) => userId === p.id)
      return {
        ...p,
        accomplishedDates: match ? match.challengeAccomplishments : [],
      }
    }
  )

  return {
    ...challenge,
    createdBy: {
      ...Auth0UserSchema.parse(challenge.createdBy),
      __typename: 'Creator',
    },
    participants: participants.map((p) => {
      return {
        ...p,
        __typename: 'ChallengeParticipant',
      }
    }),
    __typename: 'Challenge',
  }
}

export const remove = async (id: string) => {
  await ChallengeEntity.delete(getChallengePrimaryKey(id), {
    returnValues: 'ALL_OLD',
  })
  return true
}

export const removeMany = async (ids: string[]) => {
  if (ids.length > 25) {
    throw new Error('Can only remove max 25 items in one batch operation')
  }

  await ChallengeEntity.table?.batchWrite(
    ids.map((id) => {
      return ChallengeEntity.deleteBatch(getChallengePrimaryKey(id))
    })
  )
}

const getOptions = (filter: QueryChallengesArgs['filter']) => {
  const options = {
    index: 'GSI1',
  }

  if (filter == null) {
    return options
  }

  const { before, after } = filter.dateEnd

  if (before != null) {
    return {
      index: 'GSI1',
      lt: `DATE#${DynamoDatetime.fromISO(before).getISODate()}`,
    }
  }
  if (after != null) {
    return {
      index: 'GSI1',
      gte: `DATE#${DynamoDatetime.fromISO(after).getISODate()}`,
    }
  }

  return options
}

export const getAll = async (
  filter: QueryChallengesArgs['filter']
): Promise<Challenge[]> => {
  const options = getOptions(filter)

  const results = await ChallengeEntity.query(`CHALLENGE#CHALLENGE`, options)

  if (!results.Items) {
    return []
  }

  return results.Items.map((data) => {
    return {
      ...data,
      createdBy: {
        ...Auth0UserSchema.parse(data.createdBy),
        __typename: 'Creator',
      },
      participants: participantHashMapToList(data.participants).map((p) => ({
        ...p,
        __typename: 'ChallengeParticipant',
      })),
      __typename: 'Challenge',
    }
  })
}

const participationFunctions = getParticipationFunctions({
  documentClient: ChallengeEntity.DocumentClient,
  getPrimaryKey: getChallengePrimaryKey,
  tableName: ChallengeEntity.table?.name,
})

export const participate = participationFunctions.participate
export const leave = participationFunctions.leave

type ISODate = string

const getChallengeAccomplishmentPrimaryKey = (
  challengeId: string,
  userId: string
) => {
  return {
    PK: `CHALLENGE#${challengeId}`,
    SK: `USER#${userId}`,
  }
}

interface AccomplishmentInput {
  id: string
  userId: string
  date: ISODate
}

const isBetweenISODate = (
  start: ISODate,
  end: ISODate,
  date: ISODate
): boolean => {
  if (date < start) {
    return false
  }
  if (date > end) {
    return false
  }
  return true
}

const verifyChallenge = async (id: string, userId: string) => {
  const result = await ChallengeEntity.get(getChallengePrimaryKey(id), {
    attributes: ['participants', 'dateStart', 'dateEnd'],
  })
  if (!result.Item) {
    throw new Error('Challenge does not exist')
  }
  const participant = result.Item.participants[userId]
  if (participant == null) {
    throw new Error('User is not participating the challenge')
  }

  return result.Item
}

export const addAccomplishment = async ({
  id,
  userId,
  date,
}: AccomplishmentInput) => {
  const { dateStart, dateEnd } = await verifyChallenge(id, userId)

  if (!isBetweenISODate(dateStart, dateEnd, date)) {
    throw new Error('Can not insert date that is outside challenge dates')
  }

  const now = new Date().toISOString().slice(0, 10) // Just date

  if (date > now) {
    throw new Error('Can not insert date that is in future')
  }

  const verifiedDate = DynamoDatetime.fromISO(date).getISODate()
  await ChallengeAccomplishment.update(
    {
      ...getChallengeAccomplishmentPrimaryKey(id, userId),
      userId,
      challengeAccomplishments: { $add: [verifiedDate] },
    },
    { returnValues: 'NONE' }
  )
}

export const removeAccomplishment = async ({
  id,
  userId,
  date,
}: AccomplishmentInput) => {
  await verifyChallenge(id, userId)
  const now = new Date().toISOString().slice(0, 10) // Just date

  if (date > now) {
    throw new Error('Can remove date that is in future')
  }

  const verifiedDate = DynamoDatetime.fromISO(date).getISODate()
  await ChallengeAccomplishment.update(
    {
      ...getChallengeAccomplishmentPrimaryKey(id, userId),
      challengeAccomplishments: { $delete: [verifiedDate] },
    },
    { returnValues: 'NONE' }
  )
}
