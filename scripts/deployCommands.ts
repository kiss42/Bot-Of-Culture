import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { SlashCommand } from '../src/utils/types'

dotenv.config()
const clientId: string = process.env.APP_ID ?? ''
const token: string = process.env.DISCORD_TOKEN ?? ''
// For deploying to specific guild, useful for testing new commands
const guildId: string = process.env.GUILD_ID ?? ''

// Deploys commands for the bot
const commands: SlashCommand[] = []

const deployCommands = async () => {
  // Construct and prepare the rest module
  const rest = new REST({ version: '10' }).setToken(token)
  try {
    console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
    )

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
    )

    if (process.argv[2] === 'global') {
      // Load global commands
      await rest.put(Routes.applicationCommands(clientId), { body: commands })
      console.log(
          `Successfully reloaded ${(<any>data).length} global (/) commands.`,
      )
    }

    console.log(
        `Successfully reloaded ${(<any>data).length} application (/) commands.`,
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
}

/** *** TODO: Duplicated code because I'm lazy, refactor to common utility that both deployCommands and loadCommands can use *** */
function isValidCommandFile(file: string) {
  return file.endsWith('.ts')
}

function isValidDirectory(file: string, dirPath: string) {
  const filePath = path.join(dirPath, file)
  const ignoredFolders = ['utils', 'buttons', 'modals']
  return (
      fs.lstatSync(filePath.toString()).isDirectory() &&
      !ignoredFolders.includes(file)
  )
}

/**
 * Looks through the commands folder and recursively adds each file (including subdirectories) to the bot client
 * @param dirPath current directory to search
 * @param  commandList List of commands
 */
async function loadDirectoryContents(
    dirPath: string,
    commandList: SlashCommand[],
) {
  const commandFiles = fs
      .readdirSync(dirPath)
      .filter(
          (file) => isValidCommandFile(file) || isValidDirectory(file, dirPath),
      )

  for (const file of commandFiles) {
    const filePath = path.join(dirPath, file)
    // If subdirectory, read and load its file contents and other potential subdirectories
    if (fs.lstatSync(filePath).isDirectory()) {
      await loadDirectoryContents(filePath, commandList)
    } else {
      const command = await import(`../${filePath}`).then(
          (module) => module.default,
      )
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        commandList.push(command.data.toJSON())
        console.log(`/${command.data.name} added`)
      } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        )
      }
    }
  }
}

loadDirectoryContents('./src/commands', commands).then(deployCommands)
