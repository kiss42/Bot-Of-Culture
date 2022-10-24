import { Collection, Events, GatewayIntentBits, REST } from 'discord.js'
import dotenv from 'dotenv'
import { loadCommands } from './utils/loadCommands'
import { BotClient } from './utils/types'
import { loadEvents } from './utils/loadEvents'

dotenv.config()
const token: string = process.env.DISCORD_TOKEN ?? ''

const bot: BotClient = new BotClient({ intents: [GatewayIntentBits.Guilds] })
loadEvents(bot)

bot.commands = new Collection() // Attach command collection to bot so that it can be accessed anywhere
loadCommands(bot)

bot.once(Events.ClientReady, () => {
  console.log(`Logged in as ${bot.user?.username}!`)
})
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return //Ignore non-chat commands

  const client = interaction.client as BotClient
  const command = client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

bot.login(token)
