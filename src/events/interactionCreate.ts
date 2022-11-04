import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Events,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from 'discord.js'
import { BotClient } from 'src/Bot'

const event = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    let command
    if (interaction.isChatInputCommand())
      command = await getChatCommandName(interaction)
    else if (interaction.isMessageComponent() || interaction.isModalSubmit())
      command = await getReplyCommand(interaction)
    else return

    if (!command) {
      console.error('No matching command was found.')
      return
    }

    try {
      await command.execute(interaction as ChatInputCommandInteraction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  },
}

async function getChatCommandName(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as BotClient
  return client.commands.get(interaction.commandName)
}

async function getReplyCommand(
  interaction: MessageComponentInteraction | ModalSubmitInteraction,
) {
  const client = interaction.client as BotClient
  const buttonAction = interaction.customId.split('_')[0]
  return client.commands.get(buttonAction)
}

export default event
