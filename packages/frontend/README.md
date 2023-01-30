# Remix frontend

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
yarn run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Local Playwright testing

1. Create a user in Auth0 dev environment
2. Create `.env` and fill with info from Auth0

```
{
  "USER_EMAIL": "...",
  "USER_PASSWORD": "...",
  "USER_NICK": "..."
}
```

3. Credentials are read from `storageState.json`. Delete the file to renew credentials. With wrong tests will fail.
4. `npx install playwright` to install browsers

Then run the app in production mode:

```sh
yarn start
```
