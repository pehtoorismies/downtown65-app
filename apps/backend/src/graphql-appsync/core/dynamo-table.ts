import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity, Table, attribute, schema } from 'dynamodb-toolbox'
import { Config } from 'sst/node/config'

const dynamoDBClient = new DynamoDBClient()

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    convertEmptyValues: false,
  },
})

export const EntityNames = {
  Dt65EventEntity: 'Dt65Event',
  ChallengeEntity: 'Challenge',
  ChallengeAccomplishment: 'ChallengeAccomplishment',
} as const

export const DtTable = new Table({
  name: Config.TABLE_NAME,
  partitionKey: { name: 'PK', type: 'string' },
  sortKey: { name: 'SK', type: 'string' },
  documentClient,
  indexes: {
    GSI1: {
      type: 'global',
      partitionKey: { name: 'GSI1PK', type: 'string' },
      sortKey: { name: 'GSI1SK', type: 'string' },
    },
  },
})

export const Dt65EventEntity = new Entity({
  name: EntityNames.Dt65EventEntity,
  table: DtTable,
  schema: schema({
    PK: attribute.string().key().hidden(),
    SK: attribute.string().key().hidden(),
    GSI1PK: attribute.string().hidden(),
    GSI1SK: attribute.string().hidden(),
    createdBy: attribute.map({
      id: attribute.string(),
      nickname: attribute.string(),
      picture: attribute.string(),
    }),
    dateStart: attribute.string(),
    description: attribute.string().optional(),
    id: attribute.string().savedAs('eventId'),
    participants: attribute.any(), // TODO: change to map
    race: attribute.boolean().default(false),
    location: attribute.string(),
    subtitle: attribute.string(),
    timeStart: attribute.string().optional(),
    title: attribute.string(),
    type: attribute.string(), // TODO: use enum
  }),
})

export const ChallengeEntity = new Entity({
  name: EntityNames.ChallengeEntity,
  table: DtTable,
  schema: schema({
    PK: attribute.string().key().hidden(),
    SK: attribute.string().key().hidden(),
    GSI1PK: attribute.string().hidden(),
    GSI1SK: attribute.string().hidden(),
    createdBy: attribute.map({
      id: attribute.string(),
      nickname: attribute.string(),
      picture: attribute.string(),
    }),
    dateStart: attribute.string(),
    dateEnd: attribute.string(),
    description: attribute.string().optional(),
    id: attribute.string().savedAs('eventId'),
    participants: attribute.any(), // TODO: change to map
    subtitle: attribute.string(),
    title: attribute.string(),
  }),
})

export const ChallengeAccomplishment = new Entity({
  name: EntityNames.ChallengeAccomplishment,
  table: DtTable,
  schema: schema({
    PK: attribute.string().key().hidden(),
    SK: attribute.string().key().hidden(),
    userId: attribute.string(),
    challengeAccomplishments: attribute.set(attribute.string()),
  }),
})
