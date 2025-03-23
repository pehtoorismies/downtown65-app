import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity } from 'dynamodb-toolbox/entity'
import { item, s } from 'dynamodb-toolbox/schema'
import { Table } from 'dynamodb-toolbox/table'
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
  schema: item({
    PK: s.string().key().hidden(),
    SK: s.string().key().hidden(),
    GSI1PK: s.string().hidden(),
    GSI1SK: s.string().hidden(),
    createdBy: s.map({
      id: s.string(),
      nickname: s.string(),
      picture: s.string(),
    }),
    dateStart: s.string(),
    description: s.string().optional(),
    eventId: s.string(),
    participants: s.any(), // TODO: change to map
    race: s.boolean().default(false),
    location: s.string(),
    subtitle: s.string(),
    timeStart: s.string().optional(),
    title: s.string(),
    type: s.string(), // TODO: use enum
  }),
})
