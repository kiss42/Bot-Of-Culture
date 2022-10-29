import { Collection, Events, GatewayIntentBits, REST } from 'discord.js'
import dotenv from 'dotenv'
import { loadCommands } from './utils/loadCommands'
import { BotClient } from './utils/types'
import { loadEvents } from './utils/loadEvents'
dotenv.config()
const token: string = process.env.DISCORD_TOKEN ?? ''

const bot: BotClient = new BotClient({ intents: [GatewayIntentBits.Guilds] })
bot.commands = new Collection() // Attach command collection to bot so that it can be accessed anywhere

loadCommands(bot)
  .then(() => loadEvents(bot))
  .then(() => bot.login(token))

process.once('exit', async () => {
  await bot.db.$disconnect()
  console.log('Exiting...')
})