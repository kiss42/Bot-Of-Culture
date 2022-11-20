import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageComponentInteraction,
} from 'discord.js'
import { BotClient } from 'src/Bot'
import { convertScoreToStars } from '../movies/utils'
import {
  IMovieReview,
  IReview,
  ISeriesReview,
  SeriesSearchResult,
} from '../../../utils/types'
import { toNormalDate } from '../../../utils/helpers'

const command = {
  data: { name: 'searchSelect' },
  execute: getSearchResultInfo,
}

async function getSearchResultInfo(interaction: MessageComponentInteraction) {
  const params = interaction.customId.split('_')
  const id = params[3]
  const resultType = params[1]
  const guildId = interaction.guildId
  const bot = interaction.client as BotClient

  await interaction.deferUpdate()

  try {
    let serverReviews: IReview[]
    if (resultType === 'movie')
      serverReviews = (await bot.db.movieReview.findMany({
        where: { movieId: id, guildId },
      })) as IMovieReview[]
    else
      serverReviews = (await bot.db.seriesReview.findMany({
        where: { seriesId: id, guildId },
      })) as ISeriesReview[]

    const averageScore = calculateAverageScore(serverReviews)
    const scoreDisplay = serverReviews.length
      ? convertScoreToStars(averageScore, serverReviews.length)
      : '*Not yet reviewed*'

    const result = await getByIdForType(resultType, id, bot)

    let commandPrefix = 'reviewMovie'
    let resultInfoEmbed = new EmbedBuilder()
      .setColor('#01b4e4')
      .setTitle(result.title)
      .setDescription(result.description)
      .setImage(result.image)
      .addFields([
        {
          name: 'Release Date',
          value: toNormalDate(result.date),
          inline: true,
        },
      ])

    if (resultType === 'series') {
      commandPrefix = 'reviewSeries'
      const { episodes, episodeLength, seasons, lastAirDate, status } =
        result as SeriesSearchResult
      resultInfoEmbed = resultInfoEmbed.addFields([
        { name: 'Episodes', value: episodes, inline: true },
        {
          name: 'Episode Length',
          value: `${episodeLength} minutes`,
          inline: true,
        },
        { name: 'Seasons', value: seasons, inline: true },
        {
          name: 'Last Air Date',
          value: toNormalDate(lastAirDate),
          inline: true,
        },
        { name: 'Status', value: status, inline: true },
      ])
    }

    resultInfoEmbed = resultInfoEmbed.addFields([
      { name: 'Server Score', value: scoreDisplay, inline: true },
    ])

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${commandPrefix}_button_${result.id}`)
        .setLabel('Leave a review')
        .setStyle(ButtonStyle.Success),
    )

    await interaction.editReply({
      content: '',
      embeds: [resultInfoEmbed],
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

async function getByIdForType(type: string, id: string, bot: BotClient) {
  if (type === 'movie') return await bot.movies.getById(id)
  else return await bot.movies.getSeriesById(id)
}

function calculateAverageScore(reviews: IReview[]) {
  const rawAverage =
    reviews.reduce((total: number, review) => total + review.score, 0) /
    reviews.length
  return Math.floor(rawAverage)
}

function createReviewPromptMessage(
  reviews: IReview[],
  userId: string,
): string | void {
  if (!reviews.some((review) => review.userId === userId))
    if (!reviews.length)
      return 'Looks like no one has reviewed this movie. Make everyone jealous by being the first one to review it!'
    else
      return 'Have you seen this movie before? Leave a review above and share your thoughts with the server!'
}

export default command
