import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity, Table } from 'dynamodb-toolbox'
import { Config } from 'sst/node/config'

const marshallOptions = {
  // Specify your client options as usual
  convertEmptyValues: false,
}

const translateConfig = { marshallOptions }

const DocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient(),
  translateConfig
)

const DtTable = new Table({
  name: Config.TABLE_NAME,
  partitionKey: 'PK',
  sortKey: 'SK',
  DocumentClient,
  indexes: {
    GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
  },
  attributes: {
    PK: 'string',
    SK: 'string',
  },
})

export const Dt65EventEntity = new Entity({
  name: 'Dt65Event',
  attributes: {
    PK: { partitionKey: true, hidden: true },
    SK: { hidden: true, sortKey: true },
    GSI1PK: { hidden: true },
    GSI1SK: { hidden: true },
    createdBy: { type: 'map', required: true },
    dateStart: { type: 'string', required: true },
    description: { type: 'string', required: false },
    id: { type: 'string', map: 'eventId', required: true }, // map 'id' to table attribute 'eventId'
    participants: { type: 'map', required: true },
    race: { type: 'boolean', default: false },
    location: { type: 'string', required: true },
    subtitle: { type: 'string', required: true },
    timeStart: { type: 'string', required: false },
    title: { type: 'string', required: true },
    type: { type: 'string', required: true },
  },
  table: DtTable,
} as const)

export const ChallengeEntity = new Entity({
  name: 'Challenge',
  attributes: {
    PK: { partitionKey: true, hidden: true },
    SK: { hidden: true, sortKey: true },
    GSI1PK: { hidden: true },
    GSI1SK: { hidden: true },
    createdBy: { type: 'map', required: true },
    dateStart: { type: 'string', required: true },
    dateEnd: { type: 'string', required: true },
    description: { type: 'string', required: false },
    id: { type: 'string', map: 'eventId', required: true }, // map 'id' to table attribute 'eventId'
    participants: { type: 'map', required: true },
    subtitle: { type: 'string', required: true },
    title: { type: 'string', required: true },
  },
  table: DtTable,
} as const)
