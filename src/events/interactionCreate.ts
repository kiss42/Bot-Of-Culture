import { BaseInteraction, Events } from 'discord.js'
import { BotClient } from 'src/utils/types'

const event = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
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
  },
}

export default event
