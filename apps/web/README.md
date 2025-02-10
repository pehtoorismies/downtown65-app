# Web

Main elements

* Remix (https://remix.run/).
* Mantine (https://mantine.dev/)
* Graphql-generator for types and requests

## Development

Make sure infra is deployed and running `yarn dev` from project root.

```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local Playwright testing

Note! To speed up tests authentication is stored in `playwright/.auth/user.json`.
If using UI mode, you have to run `auth.setup` separately.

> UI mode will not run the setup project by default to improve testing speed. We recommend to authenticate by manually running the auth.setup.ts from time to time, whenever existing authentication expires.


```sh

1. Create a test-user in Auth0 dev environment (or you .events to register a new user)
2. Create `.env` and fill with info with your created user from Auth0 (see below)
3. `yarn dlx install playwright` to install browsers

```txt
# .env
USER_EMAIL=<fill email>
USER_PASSWORD=<fill password>
USER_NICK=<fill nick>
REGISTER_SECRET=<use sst secrets to reveal this>
```




Then run the app in production mode:

```sh
yarn start
```
