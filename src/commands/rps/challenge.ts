import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
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

  interaction.reply(`Thanks for selecting ${choice}. We're still working on what to do with it`)
}

export default command
