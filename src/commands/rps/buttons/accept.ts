import { ActionRowBuilder, MessageComponentInteraction, SelectMenuBuilder } from 'discord.js'
import { getShuffledOptions } from '../utils'

const command = {
  data: { name: 'acceptChallenge' },
  execute: sendGameAcceptance,
}

async function sendGameAcceptance(interaction: MessageComponentInteraction) {
  const gameId = interaction.customId.replace('acceptChallenge_button_', '')

  try {
    const actionRow = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`selectChallenge_choice_${gameId}`)
        .addOptions(...(getShuffledOptions() as any))
    )
    await interaction.reply({
      content: 'What is your object of choice?',
      ephemeral: true,
      components: [actionRow as any],
    })
    await interaction.message.delete()
  } catch (error) {
    console.error(error)
  }
}

export default command
