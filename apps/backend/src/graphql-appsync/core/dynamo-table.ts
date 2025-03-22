import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import {
  Entity,
  Table,
  any,
  boolean,
  item,
  map,
  string,
} from 'dynamodb-toolbox'
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
    PK: string().key().hidden(),
    SK: string().key().hidden(),
    GSI1PK: string().hidden(),
    GSI1SK: string().hidden(),
    createdBy: map({
      id: string(),
      nickname: string(),
      picture: string(),
    }),
    dateStart: string(),
    description: string().optional(),
    eventId: string(),
    participants: any(), // TODO: change to map
    race: boolean().default(false),
    location: string(),
    subtitle: string(),
    timeStart: string().optional(),
    title: string(),
    type: string(), // TODO: use enum
  }),
})
