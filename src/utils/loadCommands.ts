import fs from 'node:fs'
import path from 'node:path'
import { BotClient } from './types'

export async function loadCommands(client: BotClient) {
  const commandsPath = path.join(`${__dirname}/../`, 'commands')
  await loadDirectoryContents(commandsPath, client)
}

function isValidCommandFile(file: string) {
  return file.endsWith('.ts')
}

function isValidDirectory(file: string, dirPath: string) {
  const filePath = path.join(dirPath, file)
  return fs.lstatSync(filePath.toString()).isDirectory() && file !== 'utils'
}
/**
 * Looks through the commands folder and recursively adds each file (including subdirectories) to the bot client
 * @param dirPath current directory to search
 * @param commandsPath commands directory
 * @param client Discord Bot client to set commands for
 */
async function loadDirectoryContents(dirPath: string, client: BotClient) {
  const commandFiles = fs
    .readdirSync(dirPath)
    .filter((file) => isValidCommandFile(file) || isValidDirectory(file, dirPath))

  for (const file of commandFiles) {
    const filePath = path.join(dirPath, file)
    // If subdirectory, read and load its file contents and other potential subdirectories
    if (fs.lstatSync(filePath).isDirectory()) {
      await loadDirectoryContents(filePath, client)
    } else {
      const command = await import(filePath).then((module) => module.default)
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
      }
    }
  }
}
