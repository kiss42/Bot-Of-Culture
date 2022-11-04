import { MovieReview } from '@prisma/client'
import dayjs from 'dayjs'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageComponentInteraction,
} from 'discord.js'
import { BotClient } from 'src/Bot'
import { convertScoreToStars } from '../utils'

const command = {
  data: { name: 'selectMovie' },
  execute: getMovieInfo,
}

async function getMovieInfo(interaction: MessageComponentInteraction) {
  const movieId = interaction.customId.replace('selectMovie_button_', '')
  const guildId = interaction.guildId
  const bot = interaction.client as BotClient

  await interaction.deferUpdate()

  try {
    const serverReviews: MovieReview[] = await bot.db.movieReview.findMany({
      where: { movieId, guildId },
    })
    const averageScore = calculateAverageScore(serverReviews)
    const scoreDisplay = serverReviews.length
      ? convertScoreToStars(averageScore, serverReviews.length)
      : '*Not yet reviewed*'
    const movie = await bot.movies.getById(movieId)

    const movieInfoEmbed = new EmbedBuilder()
      .setColor('#01b4e4')
      .setTitle(movie.title)
      .setDescription(movie.description)
      .setImage(movie.image)
      .addFields([
        {
          name: 'Release Date',
          value: dayjs(movie.date).format('MMMM D, YYYY'),
        },
        { name: 'Server Score', value: scoreDisplay },
      ])

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`reviewMovie_button_${movie.id}`)
        .setLabel('Leave a review')
        .setStyle(ButtonStyle.Success),
    )

    await interaction.editReply({
      content: '',
      embeds: [movieInfoEmbed as any],
      components: [],
    })

    const reviewPrompt = createReviewPromptMessage(
      serverReviews,
      interaction.user.id,
    )
    if (reviewPrompt)
      await interaction.followUp({
        content: reviewPrompt,
        components: [actionRow as any],
        ephemeral: true,
      })
  } catch (error) {
    console.error(error)
    await interaction.editReply({
      content:
        'Sorry, something must have went wrong. 🫣 Try again in a moment.',
      components: [],
    })
  }
}

function calculateAverageScore(reviews: MovieReview[]) {
  const rawAverage =
    reviews.reduce((total, review) => total + review.score, 0) / reviews.length
  return Math.floor(rawAverage)
}

function createReviewPromptMessage(
  reviews: MovieReview[],
  userId: string,
): string | void {
  if (!reviews.some((review) => review.user.userId === userId))
    if (!reviews.length)
      return 'Looks like no one has reviewed this movie. Make everyone jealous by being the first one to review it!'
    else
      return 'Have you seen this movie before? Leave a review above and share your thoughts with the server!'
}

export default command
