import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import type { CreateChallengeInput } from '@downtown65-app/graphql/graphql'
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

  const start = new DynamoDatetime({
    dates: dateStart,
  })

  const end = new DynamoDatetime({
    dates: dateEnd,
  })

  const gsi1sk = end.getDate()

  await ChallengeEntity.put(
    ChallengeCreateSchema.parse({
      // add keys
      ...getPrimaryKey(id),
      GSI1PK: `CHALLENGE#FUTURE`,
      GSI1SK: `DATE#${gsi1sk}#${id.slice(0, 8)}`,
      // add props
      createdBy,
      dateStart: start.getDate(),
      dateEnd: end.getDate(),
      description,
      id,
      subtitle,
      title,
    }),
    { returnValues: 'NONE' }
  )

  return id
}

export const getById = async (id: string) => {
  const result = await ChallengeEntity.get(getPrimaryKey(id))

  if (!result.Item) {
    return null
  }

  const createdBy = Auth0UserSchema.parse(result.Item.createdBy)

  return {
    ...result.Item,
    createdBy,
  }
}

export const remove = async (id: string): Promise<boolean> => {
  await ChallengeEntity.delete(getPrimaryKey(id), {
    returnValues: 'ALL_OLD',
  })

  // if (!results.Attributes) {
  //   logger.warn('Challange not found', getPrimaryKey(id))
  // }
  return true
}
