import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'node:fs'
import { SlashCommand } from '../src/utils/types'

dotenv.config()
const clientId: string = process.env.APP_ID ?? ''
const token: string = process.env.DISCORD_TOKEN ?? ''
const guildId: string = process.env.GUILD_ID ?? '' // For deploying to specific guild, useful for testing new commands

// Deploys commands for the bot
const commands: SlashCommand[] = []
// Grab all the command files from the commands directory
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts') && !file.includes('index'))

console.log('commands', commandFiles)

const importCommands = async (commandFiles: Array<string>) => {
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const command = await import(`../src/commands/${file}`)
    commands.push(command.default.data.toJSON())
  }
}

const deployCommands = async () => {
  // Construct and prepare the rest module
  const rest = new REST({ version: '10' }).setToken(token)
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    if (process.argv[2] === 'global') {
      // Load global commands
      await rest.put(Routes.applicationCommands(clientId), { body: commands })
      console.log(`Successfully reloaded ${(<any>data).length} global (/) commands.`)
    }

    console.log(`Successfully reloaded ${(<any>data).length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
}

importCommands(commandFiles).then(deployCommands)
