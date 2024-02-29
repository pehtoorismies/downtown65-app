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

### Setup AWS

#### AWS Account

Request a new AWS account for development.

#### AWS profile

Configure AWS profile for local development:

```
# ~/.aws/config
[profile downtown65-development]
sso_session = downtown65
sso_account_id = <AWS_account_id>
sso_role_name = AdministratorAccess
region = eu-north-1
output = json

[sso-session downtown65]
sso_start_url = https://downtown65.awsapps.com/start#
sso_region = eu-north-1
sso_registration_scopes = sso:account:access
```

Make sure that you have AWS client installed (https://aws.amazon.com/cli/)

Use `direnv` to load AWS profile ie. add `.envrc` file which will load correct AWS profile automatically
when in project directory.

```
# .envrc
# Use profile from ~/.aws/config
export AWS_PROFILE=downtown65-development
```

User `yarn login` to login to AWS.

#### SST config

Define a local development stage in file `.sst/stage`. This will be your default stage. All the
AWS resources will be named after.

```sh
# .sst/stage
# should contain your development stage
$ echo 'downtown65-app-your-username' > .sst/stage
```

### Yarn

Use yarn > 4 (modern)

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
# Create AWS infra
$ yarn dev 
```

Start frontend. NOTE! You need to set sst-secrets to allow Remix server to start (see step below).

```bash
# Start Remix client that connects to AWS.
$ cd apps/web
$ yarn dev 
```

### Add secrets

[https://docs.sst.dev/environment-variables#sst-secrets](https://docs.sst.dev/environment-variables#sst-secrets)

Add your own development secrets to AWS parameter store.

```bash
# secret value used in registration form
$ yarn sst secrets set REGISTER_SECRET <secret_here>
# secret value to use with Auth0 Client (get it from Auth0 dev tenant https://manage.auth0.com/dashboard/eu/dev-dt65)
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

Single table design is used. Documentation pending...
