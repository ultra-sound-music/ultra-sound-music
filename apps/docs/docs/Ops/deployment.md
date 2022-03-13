# Deployment

We deploy the app(s) via AWS, each build is from the main branch of the USM mono repo.

## Client

This is the [web client](../Applications/web.md), a production, consumer facing application, including the auction site.

## Client Dev

This is a dev build of the web client that we use for internal testing. It's also built from the main branch but it uses a different set of environment variables and configs.

## UI

This is a build of our Storyboook [ui component library](../Libraries/ui.md).

## Docs

This is a build of our internal [technical documentation](../Applications/docs.md).
