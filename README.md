# Downtown 65 App

An example serverless app created with SST.

## Infra

[**Infra is deployed with Serverless Stack**](https://sst.dev/)

## Dynamo single table design


### Getting started


```bash
$ yarn
$ yarn start  
```

Give your local dev environment some name like: `downtown65-app-yourusername`. This will be your default stage. All the AWS resources will be named after

This name can be changed in `.sst/stage` 

### Add secrets

[https://docs.sst.dev/environment-variables#sst-secrets](https://docs.sst.dev/environment-variables#sst-secrets)

```bash
# secret value used in registration form
$ npx sst secrets set REGISTER_SECRET <secret_here>
# secret value to use with Auth0 Client
$ npx sst secrets set AUTH_CLIENT_SECRET <secret_here>
```

## Commands

### `npm run start`

Starts the Live Lambda Development environment.

### `npm run build`

Build your app and synthesize your stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

### `npm run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## GraphQL API

Default authentication 
