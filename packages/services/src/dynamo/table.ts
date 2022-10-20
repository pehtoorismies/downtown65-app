import { Config } from '@serverless-stack/node/config'
import { DynamoDB } from 'aws-sdk'
import { Entity, Table } from 'dynamodb-toolbox'

const DocumentClient = new DynamoDB.DocumentClient()

export const getTable = () => {
  const tableName = Config.TABLE_NAME

  const table = new Table({
    name: tableName,
    partitionKey: 'PK',
    sortKey: 'SK',
    DocumentClient,
    indexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
      GSI2: { partitionKey: 'GSI2PK', sortKey: 'GSI2SK' },
    },
    attributes: {
      PK: 'string',
      SK: 'string',
      GSI1PK: 'string',
      GSI1SK: 'string',
      GSI2PK: 'string',
      GSI2SK: 'string',
      // Dt65Event properties
      eventId: 'string',
      createdBy: 'map',
      dateStart: 'string',
      description: 'string',
      title: 'string',
      location: 'string',
      participants: 'map',
      race: 'boolean',
      type: 'string',
      // Participant properties
      nickname: 'string',
    },
  })

  const Dt65EventEntity = new Entity({
    name: 'Dt65Event',
    attributes: {
      PK: { partitionKey: true, hidden: true }, // flag as partitionKey
      SK: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
      GSI1PK: { hidden: true },
      GSI1SK: { hidden: true },
      createdBy: { type: 'map', required: true },
      dateStart: { type: 'string', required: true },
      description: { type: 'string', required: false },
      id: { type: 'string', map: 'eventId' }, // map 'id' to table attribute 'eventId'
      participants: { type: 'map', required: true },
      race: { type: 'boolean', default: false },
      location: { type: 'string', required: true },
      title: { type: 'string', required: true },
      type: { type: 'string', required: true },
    },
  } as const)

  const ParticipantEntity = new Entity({
    name: 'Participant',
    attributes: {
      PK: { partitionKey: true, hidden: true }, // flag as partitionKey
      SK: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
      GSI2PK: { hidden: true },
      GSI2SK: { hidden: true },
      nickname: { type: 'string', required: true },
    },
  } as const)

  table.entities = [Dt65EventEntity, ParticipantEntity]

  return table
}
