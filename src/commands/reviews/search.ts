import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithMovieResults } from './movies/utils'
import { handleSubcommand } from '../utils/helpers'

const command = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a movie')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('movie')
        .setDescription('Search for a movie')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the movie you wish to search')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('series')
        .setDescription('Search for a series')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the series you wish to search')
            .setRequired(true),
        ),
    ),
  execute: (interaction: ChatInputCommandInteraction) => {
    handleSubcommand(interaction, subcommandExecutors)
  },
}

const subcommandExecutors = {
  movie: searchMovie,
  series: searchSeries,
}

async function searchMovie(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'selectMovie'
  await replyWithMovieResults(interaction, commandPrefix, '', false)
}

async function searchSeries(interaction: ChatInputCommandInteraction) {
  // const commandPrefix = 'selectSeries'
  await interaction.reply({
    content: 'I\'m not quite ready for that command yet!',
  })
}

export default command
