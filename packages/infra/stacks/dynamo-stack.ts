import type { StackContext } from '@serverless-stack/resources'
import { Config, Table } from '@serverless-stack/resources'

export const DynamoStack = ({ stack }: StackContext) => {
  const table = new Table(stack, 'dt65Table', {
    fields: {
      PK: 'string',
      SK: 'string',
      GSI1PK: 'string',
      GSI1SK: 'string',
      GSI2PK: 'string',
      GSI2SK: 'string',
    },
    primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    globalIndexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
      GSI2: { partitionKey: 'GSI2PK', sortKey: 'GSI2SK' },
    },
    stream: true,
  })

  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, 'TABLE_NAME', {
      value: table.tableName,
    }),
  }
}
