import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { replyWithResults } from './utils'

const command = {
  data: new SlashCommandBuilder()
    .setName('delete-review')
    .setDescription('Delete a previous review')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('movie')
        .setDescription('Delete review for a movie')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the movie you reviewed')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('series')
        .setDescription('Delete review for a series')
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the series you reviewed')
            .setRequired(true),
        ),
    ),
  execute: handleDeleteReview,
}

async function handleDeleteReview(interaction: ChatInputCommandInteraction) {
  const type = interaction.options.getSubcommand()
  const isSeries = type === 'series'
  const commandPrefix = `deleteReview_${type}`
  await replyWithResults(interaction, commandPrefix, '', true, isSeries)
}

export default command
