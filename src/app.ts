import { Client, GatewayIntentBits, REST } from 'discord.js'
import dotenv from 'dotenv'
import { createCommandRoutes } from './commands'
import { sendGameInvite } from './commands/rps'

dotenv.config()
const token: string = process.env.DISCORD_TOKEN ?? ''

const rest = new REST().setToken(token)
// Creates REST routes with installed slash commands
createCommandRoutes(rest)

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const activeGames = {}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.username}!`)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong')
  }

  if (interaction.commandName === 'challenge') {
    await sendGameInvite(activeGames, interaction)
  }
})

client.login(token)
