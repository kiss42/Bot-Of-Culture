import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithGameResults } from './utils'

const command = {
    data: new SlashCommandBuilder()
    .setName('review-game')
    .setDescription('Leave a review for a game')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the game you wish to review')
        .setRequired(true),
    ),
  execute: startReview,
}
async function startReview(interaction: ChatInputCommandInteraction) {
    const commandPrefix = 'reviewGame'
    const additionalMessage =
      '*If already reviewed, you will be updating your previous score.*'
    await replyWithGameResults(
      interaction,
      commandPrefix,
      additionalMessage,
      true,
    )
  }

  export default command