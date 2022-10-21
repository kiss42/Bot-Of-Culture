import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import { rpsCommands } from './rps'

dotenv.config()
const clientId: string = process.env.APP_ID ?? ''

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  ...rpsCommands,
]

export async function createCommandRoutes(rest: REST) {
  try {
    console.log('Started referring application (/) commands.')

    await rest.put(Routes.applicationCommands(clientId), { body: commands })
    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}
