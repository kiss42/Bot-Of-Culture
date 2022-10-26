import fs from 'node:fs'
import path from 'node:path'
import { BotClient } from './types'

export async function loadCommands(bot: BotClient) {
  const commandsPath = path.join(`${__dirname}/../`, 'commands')
  await loadDirectoryContents(commandsPath, bot)
}

function isValidCommandFile(file: string) {
  return file.endsWith('.ts')
}

function isValidDirectory(file: string, dirPath: string) {
  const filePath = path.join(dirPath, file)
  const ignoredFolders = ['utils']
  return fs.lstatSync(filePath.toString()).isDirectory() && !ignoredFolders.includes(file)
}
/**
 * Looks through the commands folder and recursively adds each file (including subdirectories) to the bot client
 * @param dirPath current directory to search
 * @param commandsPath commands directory
 * @param bot Discord Bot client to set commands for
 */
async function loadDirectoryContents(dirPath: string, bot: BotClient) {
  const commandFiles = fs
    .readdirSync(dirPath)
    .filter((file) => isValidCommandFile(file) || isValidDirectory(file, dirPath))

  for (const file of commandFiles) {
    const filePath = path.join(dirPath, file)
    // If subdirectory, read and load its file contents and other potential subdirectories
    if (fs.lstatSync(filePath).isDirectory()) {
      await loadDirectoryContents(filePath, bot)
    } else {
      const command = await import(filePath).then((module) => module.default)
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        bot.commands.set(command.data.name, command)
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
      }
    }
  }
}
