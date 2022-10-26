import { MessageComponentInteraction, SelectMenuInteraction } from 'discord.js'
import { BotClient } from 'src/utils/types'
import { getRandomEmoji, getResult } from '../utils'

const command = {
  data: { name: 'selectChallenge' },
  execute: sendGameReply,
}

async function sendGameReply(interaction: MessageComponentInteraction) {
  const gameId = interaction.customId.replace('selectChallenge_choice_', '')
  const bot = interaction.client as BotClient

  if (bot.activeGames[gameId]) {
    const userId = interaction.user.id
    const choice = (<SelectMenuInteraction>interaction).values[0]
    //Calculate result from helper function
    const resultStr = getResult(bot.activeGames[gameId], {
      id: userId,
      choice,
    })

    // Remove game from storage
    delete bot.activeGames[gameId]
    // Update message with token in request body
    try {
      // Send results
      await interaction.update({ content: `Nice choice ${getRandomEmoji()}`, components: [] })
      await interaction.followUp(resultStr)
      // TODO: Fix Update ephemeral message
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }
}

export default command
