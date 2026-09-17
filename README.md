# Phanoria Adventure

[adventure.alexlockhart.me](https://adventure.alexlockhart.me)

[![Netlify Status](https://api.netlify.com/api/v1/badges/dec11db1-de2b-4c40-9b90-a2e5221a6969/deploy-status)](https://app.netlify.com/sites/lockhart-dnd/deploys)

## Install

Create a `.env` file in the root of the project:

```
CONTENTFUL_API_TOKEN=
SPACE_ID=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
```

```
nvm use 24.16.0
npm install
```

## Build

```
npm run build
```

## Develop

```
npm run serve
```

Open [localhost:3000](http://localhost:3000)

## Login

Login uses the shared Megazear Auth0 tenant and requests access for the
Megazear identity API at `https://identity.megazear7.com`. Configure
`AUTH0_DOMAIN` and `AUTH0_CLIENT_ID` in the local `.env` file and in Netlify's
build environment. The Phanoria origin must also be registered in the Auth0
application and the identity service's `AUTHORIZED_ORIGINS` setting.
