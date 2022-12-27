# Bot of Culture

Discord Bot curated for the Men of Culture Discord Server

## How to Install
If you want to run your own version of Bot of Culture locally, it's a fairly straightforward process. It requires that you set up its 3 main dependencies:
- A Discord App with API credentials
- A MongoDb Instance for Prisma to use
- Access keys to the Movie and TV APIs
  - [The Movie Database](https://www.themoviedb.org/documentation/api)
  - [International Game Database (IGDB)](https://api-docs.igdb.com/#about) (requires Twitch app setup as well)

It may help to also have a server for you to test your bot in, but seeing as this is a Discord Bot you probably knew that already :)

The secrets for each one of these dependencies will need to live in your `.env` file in the root of project. You can use the created `env.template` as a guide for all of the values you'll need to set. (You can copy this file and rename it to `.env` for easier setup)
