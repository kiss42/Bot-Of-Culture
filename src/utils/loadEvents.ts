import path from 'node:path'
import fs from 'node:fs'
import { BotClient } from './types'

export async function loadEvents(bot: BotClient) {
  const eventsPath = path.join(`${__dirname}/../`, 'events')
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('js'))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = await import(filePath).then((module) => module.default)
    if (event.once) {
      bot.once(event.name, (...args) => event.execute(...args))
    } else {
      bot.on(event.name, (...args) => event.execute(...args))
    }
  }
}
