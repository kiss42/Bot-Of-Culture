import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithResults } from './movies/utils'
import { handleSubcommand } from '../utils/helpers'

const command = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Leave a new review')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('movie')
        .setDescription('Review a movie')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the movie you wish to review')
            .setRequired(true),
        ),
    ),
  execute: (interaction: ChatInputCommandInteraction) =>
    handleSubcommand(interaction, subcommandExecutors),
}

const subcommandExecutors = {
  movie: startMovieReview,
}

async function startMovieReview(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'reviewMovie'
  const additionalMessage =
    '*If already reviewed, you will be updating your previous score.*'
  await replyWithResults(interaction, commandPrefix, additionalMessage, true)
}

export default command
