# Downtown 65 App

App is live in https://downtown65.events

## App structure

Monorepo structure is same as Turborepo recommends:

* `apps/web` host Remix frontend
* `apps/backend` (graphql etc)
* `packages/` common packages
* `stack/` sst AWS infrastucture
* `sst.config.ts` main entry point for infra

SST does not allow infra to be it's own workspace/package as it should. See
details https://docs.sst.dev/configuring-sst.

## Local development

### AWS

Request a new AWS account for development.

#### AWS profile

Use `direnv` to load aws _downtown65-app_ profile (`.envrc`)

```
# ~/.aws/config
[downtown65-app]
region = eu-north-1
output = json

# ~/.aws/credentials
[downtown65-app]
aws_access_key_id = ...
aws_secret_access_key = ...
```

#### SST config

Give your local dev environment some name like: `downtown65-app-yourusername`. This will be your default stage. All the
AWS resources will be named after

This name can be changed in `.sst/stage`

```
# should contain your development stage
.sst/stage
```

### Yarn modern

Use yarn > 4

```bash
$ corepack enable
$ yarn --version 
```

### Monorepo

Monorepo is using Turborepo (https://turbo.build)

```bash
$ yarn 
$ yarn sst types
$ yarn build 
```

### Development

```bash
$ yarn dev
$ cd apps/web
$ yarn dev 
```

### Add secrets

[https://docs.sst.dev/environment-variables#sst-secrets](https://docs.sst.dev/environment-variables#sst-secrets)

Add your own development secrets to AWS parameter store.

```bash
# secret value used in registration form
$ yarn sst secrets set REGISTER_SECRET <secret_here>
# secret value to use with Auth0 Client
$ yarn sst secrets set AUTH_CLIENT_SECRET <secret_here>
# secret value to use with Auth0 Client
$ yarn sst secrets set COOKIE_SECRET <secret_here>
```

### Keep consistent dependencies

Update/add packages in `installed-dependencies.json` if you want to keep same package versions across monorepo.

```bash
$ yarn constraints
$ yarn constraints --fix
```

### Generate typescript types from graphql schema

```bash
$ yarn generate
```

## Unit testing

Backend should be up and running

```bash
$ yarn dev
```

Run unit tests. Backend contains tests that integrate to AWS DynamoDB.

```bash
$ yarn test
```

## Backend

AWS lambdas for all the functionality

### Graphql API

Graphql API uses AWS Appsync. You can pickup url from `sst deploy`.

### DynamoDB

Single table design is used.
Needs some documentation.
