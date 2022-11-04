import { Events } from 'discord.js'
import { BotClient } from 'src/Bot'

const event = {
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
  },
}

export default event
