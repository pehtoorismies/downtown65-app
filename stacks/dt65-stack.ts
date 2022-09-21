import { Api, StackContext, Table } from '@serverless-stack/resources'

export const Dt65Stack = ({ stack }: StackContext) => {
  // Create the table
  const table = new Table(stack, 'downtown65', {
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
  })

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        // Pass in the table name to our API
        environment: {
          tableName: table.tableName,
        },
        permissions: [table],
      },
    },
    routes: {
      'GET /events': 'functions/events/get-events.main',
      'GET /event/{id}': 'functions/events/get-event.main',
      'DELETE /event/{id}': 'functions/events/delete-event.main',
      'POST /event': 'functions/events/create-event.main',
      'PUT /event/{id}/join': 'functions/events/join-event.main',
      'PUT /event/{id}/leave': 'functions/events/leave-event.main',
    },
  })

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
