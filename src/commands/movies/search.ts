import dayjs from 'dayjs'
import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { BotClient } from 'src/Bot'

const command = {
  data: new SlashCommandBuilder()
    .setName('search-movie')
    .setDescription('Search for information about a movie')
    .addStringOption((option) =>
      option.setName('title').setDescription('The title of the movie you wish to search').setRequired(true),
    ),
  execute: searchMovie,
}

async function searchMovie(interaction: ChatInputCommandInteraction) {
  const bot = interaction.client as BotClient
  const query = interaction.options.getString('title')

  const results = await bot.movies.search(query)

  if (results.length) {
    const actionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(
      results.map((result) => {
        let { title, date } = result
        if (title.length > 73) title = `${title.substring(0, 69)}...`

        date = dayjs(result.date).format('YYYY')
        return new ButtonBuilder()
          .setCustomId(`selectMovie_button_${result.id}`)
          .setLabel(`${title} (${date})`)
          .setStyle(ButtonStyle.Success)
      }),
    )

    await interaction.reply({
      content: 'Please select a result or try another search. 🎬',
      components: [actionRow as any],
    })
  } else {
    await interaction.reply({
      content: 'Sorry, there were no results matching your search. 😔 Please try again.',
      ephemeral: true,
    })
  }
}

export default command
