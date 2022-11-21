import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithResults } from './utils'
import { handleSubcommand } from '../utils/helpers'

const commands = {
  data: new SlashCommandBuilder()
    .setName('show-review')
    .setDescription('Show a review for yourself or a user')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('movie')
        .setDescription('Show a review for a movie')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription(
              'The title of the movie you wish to see a review for.',
            )
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName('reviewer')
            .setDescription('The user that created the review.'),
        ),
    ),

  execute: (interaction: ChatInputCommandInteraction) =>
    handleSubcommand(interaction, subcommandExecutors),
}

const subcommandExecutors = {
  movie: searchMovieReview,
}

async function searchMovieReview(interaction: ChatInputCommandInteraction) {
  const user =
    interaction.options.getUser('reviewer')?.id ?? interaction.user.id
  await replyWithResults(interaction, `searchMovieReview_${user}`, '', true)
}

export default commands
