import { DynamoDB } from 'aws-sdk'
import { Entity, Table } from 'dynamodb-toolbox'

const DocumentClient = new DynamoDB.DocumentClient({})

export const getDtEventEntity = () => {
  const tableName = process.env.tableName
  if (!tableName) {
    throw new Error('process.env.tableName missing')
  }

  const EventTable = new Table({
    name: tableName,
    partitionKey: 'PK',
    sortKey: 'SK',
    DocumentClient,
    indexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
    },
  })

  const DtEvent = new Entity({
    name: 'Dt65Event',
    attributes: {
      PK: { partitionKey: true, hidden: true }, // flag as partitionKey
      SK: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
      GSI1PK: { type: 'string', hidden: true },
      GSI1SK: { type: 'string', hidden: true },
      id: { type: 'string', map: 'eventId' }, // map 'name' to table attribute 'data'
      createdAt: { type: 'string', required: true },
      createdBy: { type: 'string', required: true },
      dateStart: { type: 'string', required: true },
      title: { type: 'string', required: true },
    },
    table: EventTable,
  } as const)

  return {
    DtEvent,
  }
}
