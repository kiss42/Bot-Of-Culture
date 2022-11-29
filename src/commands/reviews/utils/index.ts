import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageComponentInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SelectMenuBuilder,
  SelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import dayjs from 'dayjs'
import { MovieReview, Prisma, SeriesReview } from '@prisma/client'
import { reviewChoices } from '../../utils/choices'
import { BotClient } from '../../../Bot'
import { SearchResult } from '../../../utils/types'
import { toNormalDate } from '../../../utils/helpers'

type ReviewCreateResult = {
  message: string
  review: MovieReview | SeriesReview
}

async function saveMovieReview(
  data: Prisma.MovieReviewCreateInput,
  bot: BotClient,
): Promise<ReviewCreateResult> {
  let review = await bot.db.movieReview.findFirst({
    where: {
      userId: data.userId,
      movieId: data.movieId,
      guildId: data.guildId,
    },
  })

  if (review) {
    review = await bot.db.movieReview.update({
      where: { id: review.id },
      data,
    })
    return { review, message: 'Review successfully updated!' }
  } else {
    review = await bot.db.movieReview.create({ data })
    return {
      review: review as MovieReview,
      message: 'Review successfully added! 🎉',
    }
  }
}

async function saveSeriesReview(
  data: Prisma.SeriesReviewCreateInput,
  bot: BotClient,
): Promise<ReviewCreateResult> {
  let review = await bot.db.seriesReview.findFirst({
    where: {
      userId: data.userId,
      seriesId: data.seriesId,
      guildId: data.guildId,
    },
  })

  if (review) {
    review = await bot.db.seriesReview.update({
      where: { id: review.id },
      data,
    })
    return { review, message: 'Review successfully updated!' }
  } else {
    review = await bot.db.seriesReview.create({ data })
    return {
      review: review as SeriesReview,
      message: 'Review successfully added! 🎉',
    }
  }
}

export async function promptReview(interaction: MessageComponentInteraction) {
  const params = interaction.customId.split('_')
  const targetId = params[3]
  const type = params[1]

  try {
    const actionRow = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`reviewScore_${type}_button_${targetId}`)
        .addOptions(...(reviewChoices as any)),
    )
    await interaction.update({
      content: `Awesome! What would you rate this ${type}? 🤔`,
      components: [actionRow as any],
    })
  } catch (error) {
    console.error(error)
  }
}

export async function promptReviewComment(interaction: SelectMenuInteraction) {
  const params = interaction.customId.split('_')
  const targetId = params[3]
  const reviewScore = params[4]
  const type = params[1]

  const actionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId('reviewCommentInput')
        .setLabel(`What did you think of the ${type}?`)
        .setPlaceholder('Enter reasons behind your rating here!')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true),
    )

  const modal = new ModalBuilder()
    .setCustomId(`reviewComment_${type}_modal_${targetId}_${reviewScore}`)
    .setTitle('Review Comment')
    .addComponents(actionRow)

  await interaction.showModal(modal)
  await interaction.deleteReply()
}

export async function saveReview(
  interaction: SelectMenuInteraction | ModalSubmitInteraction,
) {
  let reviewComment
  const params = interaction.customId.split('_')
  const type = params[1]
  const bot = interaction.client as BotClient

  await interaction.deferReply({ ephemeral: true })

  if (interaction.isModalSubmit())
    reviewComment = interaction.fields.getTextInputValue('reviewCommentInput')

  const data: { [key: string]: string | number } = {
    userId: interaction.user.id,
    username: interaction.user.username,
    guildId: interaction.guildId,
    score: parseInt(params[4]),
    comment: reviewComment,
  }
  // Assign ID key by asserting from type
  data[`${type}Id`] = params[3]
  try {
    let reviewTarget, review, statusReply

    if (type === 'movie') {
      const result = await saveMovieReview(
        data as Prisma.MovieReviewCreateInput,
        bot,
      )
      review = result.review
      statusReply = result.message
      reviewTarget = await bot.movies.getById(data.movieId.toString())
    } else {
      const result = await saveSeriesReview(
        data as Prisma.SeriesReviewCreateInput,
        bot,
      )
      review = result.review
      statusReply = result.message
      reviewTarget = await bot.movies.getSeriesById(data.seriesId.toString())
    }

    if (!reviewComment) review.comment = '*No comment added*'

    const reviewInfoEmbed = createReviewEmbed(
      review,
      reviewTarget,
      interaction.user.avatarURL(),
    )

    await interaction.channel.send({
      content: `<@${review.userId}> just left a review for a ${type}!`,
      embeds: [reviewInfoEmbed as any],
      components: [],
    })

    await interaction.editReply(statusReply)
  } catch (error) {
    console.error(error)
    await interaction.editReply(
      'Sorry, something went wrong with saving your review 🫣',
    )
  }
}

export async function replyWithResults(
  interaction: ChatInputCommandInteraction,
  customIdPrefix: string,
  additionalMessage: string,
  isEphemeral: boolean,
  isSeries?: boolean,
) {
  const bot = interaction.client as BotClient
  const query = interaction.options.getString('title')

  const results = isSeries
    ? await bot.movies.searchSeries(query)
    : await bot.movies.search(query)

  if (results.length) {
    const actionRow: ActionRowBuilder<AnyComponentBuilder> =
      new ActionRowBuilder().addComponents(
        results.map((result) => {
          let { title, date } = result
          if (title.length > 73) title = `${title.substring(0, 69)}...`

          date = dayjs(date).format('YYYY')
          return new ButtonBuilder()
            .setCustomId(`${customIdPrefix}_button_${result.id}`)
            .setLabel(`${title} (${date})`)
            .setStyle(ButtonStyle.Success)
        }),
      )

    const comment = additionalMessage || ''
    const emoji = isSeries ? '📺' : '🎬'
    await interaction.reply({
      content:
        `Please select a result or try another search. ${emoji}\n ` + comment,
      components: [actionRow as any],
      ephemeral: isEphemeral,
    })
  } else {
    await interaction.reply({
      content:
        'Sorry, there were no results matching your search. 😔 Please try again.',
      ephemeral: true,
    })
  }
}

export function convertScoreToStars(score: number, count?: number) {
  const suffix = count ? ` (${count})` : ''
  return (
    '⭐️'.repeat(score) +
    '▪️'.repeat(5 - score) +
    ` | *${reviewChoices[score - 1].description}*` +
    suffix
  )
}

export function createReviewEmbed(
  review: MovieReview | SeriesReview,
  reviewTarget: SearchResult,
  avatar: string,
) {
  const formattedScore = `${convertScoreToStars(review.score)}`
  return new EmbedBuilder()
    .setColor('#01b4e4')
    .setTitle(`*"${reviewTarget.title}"* review by ${review.username}`)
    .setAuthor({
      name: review.username,
      iconURL: avatar,
    })
    .setDescription(review.comment)
    .setImage(reviewTarget.image)
    .addFields([
      { name: 'Score', value: formattedScore },
      {
        name: 'Release Date',
        value: toNormalDate(reviewTarget.date),
        inline: true,
      },
      {
        name: 'Description',
        value: reviewTarget.description,
        inline: true,
      },
    ])
}
