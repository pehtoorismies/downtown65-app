import { RemovalPolicy } from 'aws-cdk-lib'
import backup from 'aws-cdk-lib/aws-backup'
import dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Config, Table } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'

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

  if (app.stage === 'production') {
    const productionTable = dynamodb.Table.fromTableName(
      stack,
      'dt65Table-prod-table',
      table.tableName,
    )
    const plan = backup.BackupPlan.dailyMonthly1YearRetention(
      stack,
      'Production-Plan',
    )
    plan.addSelection('Selection', {
      resources: [backup.BackupResource.fromDynamoDbTable(productionTable)],
    })
  }

  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, 'TABLE_NAME', {
      value: table.tableName,
    }),
  }
}
