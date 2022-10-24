import fs from 'node:fs'
import path from 'node:path'
import { BotClient } from './types'

export async function loadCommands(client: BotClient) {
  const commandsPath = path.join(`${__dirname}/../`, 'commands')
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts') && !file.includes('index'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = await import(filePath).then((module) => module.default)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}
