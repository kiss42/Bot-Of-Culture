import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithResults } from './utils'
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('series')
        .setDescription('Review a series')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the series you wish to review')
            .setRequired(true),
        ),
    ),
  execute: (interaction: ChatInputCommandInteraction) =>
    handleSubcommand(interaction, subcommandExecutors),
}

const subcommandExecutors = {
  movie: startMovieReview,
  series: startSeriesReview,
}

async function startMovieReview(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'startReview_movie'
  const additionalMessage =
    '*If already reviewed, you will be updating your previous score.*'
  await replyWithResults(interaction, commandPrefix, additionalMessage, true)
}

async function startSeriesReview(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'startReview_series'
  const additionalMessage =
    '*If already reviewed, you will be updating your previous score.*'
  await replyWithResults(
    interaction,
    commandPrefix,
    additionalMessage,
    true,
    true,
  )
}

export default command
