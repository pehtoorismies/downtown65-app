# Web

Main elements

* Remix (https://remix.run/).
* Mantine (https://mantine.dev/)
* Graphql-generator for types and requests

## Development

Make sure infra is deploy and running `yarn dev` from project root.

```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local Playwright testing

1. Create a user in Auth0 dev environment
2. Create `.env` and fill with info from Auth0

```text
USER_EMAIL=<fill email>
USER_PASSWORD=<fill password>
USER_NICK=<fill nick>
REGISTER_SECRET=<use sst secrets to reveal this>
```

3. Credentials are read from `storageState.json`. Delete the file to renew credentials. With wrong tests will fail.
4. `yarn dlx install playwright` to install browsers

Then run the app in production mode:

```sh
yarn start
```
