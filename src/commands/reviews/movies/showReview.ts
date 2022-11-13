import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithMovieResults } from './utils'

const commands = {
  data: new SlashCommandBuilder()
    .setName('show-movie-review')
    .setDescription('Show a review for yourself or a user')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the movie you wish to see a review for.')
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName('reviewer')
        .setDescription('The user that created the review.'),
    ),
  execute: searchReview,
}

async function searchReview(interaction: ChatInputCommandInteraction) {
  const user =
    interaction.options.getUser('reviewer')?.id ?? interaction.user.id
  await replyWithMovieResults(
    interaction,
    `searchMovieReview_${user}`,
    '',
    true,
  )
}

export default commands
