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

  const activeGame = await bot.db.rPSGame.findFirst({ where: { interactionId: gameId } })

  if (activeGame) {
    //Calculate result from helper function
    const p1Info = { id: activeGame.userId, choice: activeGame.choice }
    const p2Info = { id: interaction.user.id, choice: (<SelectMenuInteraction>interaction).values[0] }
    const resultStr = getResult(p1Info, p2Info)

    // Remove game from storage
    await bot.db.rPSGame.delete({ where: { id: activeGame.id } })
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
