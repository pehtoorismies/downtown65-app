import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import type {
  Challenge,
  CreateChallengeInput,
} from '@downtown65-app/graphql/graphql'
import { format } from 'date-fns'
import { ulid } from 'ulid'
import { ChallengeCreateSchema } from '~/gql/core/dynamo-schemas/challenge-schema'
import { Auth0UserSchema } from '~/gql/core/dynamo-schemas/common'
import { ChallengeEntity } from '~/gql/core/dynamo-table'

const getPrimaryKey = (id: string) => {
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
      ...getPrimaryKey(id),
      GSI1PK: `CHALLENGE#FUTURE`,
      GSI1SK: `DATE#${gsi1sk}#${id.slice(0, 8)}`,
      // add props
      createdBy,
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
  const result = await ChallengeEntity.get(getPrimaryKey(id))

  if (!result.Item) {
    return null
  }

  return {
    ...result.Item,
    createdBy: {
      ...Auth0UserSchema.parse(result.Item.createdBy),
      __typename: 'Creator',
    },
    __typename: 'Challenge',
  }
}

export const remove = async (id: string) => {
  await ChallengeEntity.delete(getPrimaryKey(id), {
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
      return ChallengeEntity.deleteBatch(getPrimaryKey(id))
    })
  )
}

export const getUpcoming = async () => {
  const now = new Date()
  const today = format(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    'yyyy-MM-dd'
  )

  const results = await ChallengeEntity.query(`CHALLENGE#FUTURE`, {
    index: 'GSI1',
    gt: `DATE#${today}`,
  })

  if (!results.Items) {
    return []
  }

  return results.Items.map((data) => {
    return {
      ...data,
      createdBy: Auth0UserSchema.parse(data.createdBy),
    }
  })
}
