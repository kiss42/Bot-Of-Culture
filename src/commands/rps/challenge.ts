import { Prisma, prisma } from '@prisma/client'
import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { BotClient } from 'src/utils/types'
import { createCommandChoices } from './utils'

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

async function sendGameInvite(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id
  const choice = interaction.options.data[0].value.toString()
  const bot = interaction.client as BotClient

  const data: Prisma.RPSGameCreateInput = {
    interactionId: interaction.id,
    userId: userId,
    guildId: interaction.guildId,
    choice,
  }
  await bot.db.rPSGame.create({ data })

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`acceptChallenge_button_${interaction.id}`)
      .setLabel('Accept')
      .setStyle(ButtonStyle.Primary)
  )

  await interaction.reply({
    content: `Rock papers scissors challenge from <@${userId}>`,
    components: [actionRow as any],
  })
}

export default command
