import type { StackContext } from '@serverless-stack/resources'
import { Config, Table } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'

export const DynamoStack = ({ app, stack }: StackContext) => {
  const removalPolicy =
    app.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY

  const table = new Table(stack, 'dt65Table', {
    fields: {
      PK: 'string',
      SK: 'string',
      GSI1PK: 'string',
      GSI1SK: 'string',
    },
    primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    globalIndexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
    },
    stream: true,
    cdk: {
      table: {
        removalPolicy,
      },
    },
  })

  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, 'TABLE_NAME', {
      value: table.tableName,
    }),
  }
}
