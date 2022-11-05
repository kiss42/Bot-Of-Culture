import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithMovieResults } from './utils'

const command = {
  data: new SlashCommandBuilder()
    .setName('search-movie')
    .setDescription('Search for information about a movie')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the movie you wish to search')
        .setRequired(true),
    ),
  execute: searchMovie,
}

async function searchMovie(interaction: ChatInputCommandInteraction) {
  const commandPrefix = 'selectMovie'
  await replyWithMovieResults(interaction, commandPrefix, '', false)
}

export default command
