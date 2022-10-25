import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { BotClient } from 'src/utils/types'
import { createCommandChoices } from './utils/utils'

const command = {
  data: new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Challenge to a match of rock paper scissors')
    .addStringOption((option) =>
      option
        .setName('object')
        .setDescription('Pick your object')
        .setRequired(true)
        .addChoices(...createCommandChoices())
    ),
  execute: sendGameInvite,
}

function sendGameInvite(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id
  const choice = interaction.options.data[0].value as string
  const bot = interaction.client as BotClient

  bot.activeGames[interaction.id] = {
    id: userId,
    choice,
  }

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`accept_button_${interaction.id}`).setLabel('Accept').setStyle(ButtonStyle.Primary)
  )

  interaction.reply({
    content: `Rock papers scissors challenge from <@${userId}>`,
    components: [actionRow as any],
  })
}

export default command
