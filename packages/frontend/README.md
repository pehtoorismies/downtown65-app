# Remix frontend

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local Cypress testing

1. Create a user in Auth0 dev environment
2. Create `cypress.env.json` and fill with info from Auth0

```json
{
  "USER_EMAIL": "...",
  "USER_PASSWORD": "...",
  "USER_NICK": "..."
}
```

Then run the app in production mode:

```sh
yarn start
```
