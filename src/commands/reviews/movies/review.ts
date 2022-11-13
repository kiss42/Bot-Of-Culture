import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithMovieResults } from './utils'

const command = {
  data: new SlashCommandBuilder()
    .setName('review-movie')
    .setDescription('Leave a review for a movie')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the movie you wish to review')
        .setRequired(true),
    ),
  execute: startReview,
}

async function startReview(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'reviewMovie'
  const additionalMessage =
    '*If already reviewed, you will be updating your previous score.*'
  await replyWithMovieResults(
    interaction,
    commandPrefix,
    additionalMessage,
    true,
  )
}

export default command
