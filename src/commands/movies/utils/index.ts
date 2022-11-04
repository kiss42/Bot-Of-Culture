import {
  ActionRowBuilder,
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
import { reviewChoices } from './choices'
import { Prisma } from '@prisma/client'
import { BotClient } from '../../../Bot'
import dayjs from 'dayjs'

export async function promptReview(interaction: MessageComponentInteraction) {
  const movieId = interaction.customId.replace('reviewMovie_button_', '')

  try {
    const actionRow = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`reviewScore_button_${movieId}`)
        .addOptions(...(reviewChoices as any)),
    )
    await interaction.update({
      content: 'Awesome! What would you rate this movie? 🤔',
      components: [actionRow as any],
    })
  } catch (error) {
    console.error(error)
  }
}

export async function promptReviewComment(interaction: SelectMenuInteraction) {
  const params = interaction.customId.split('_')
  const movieId = params[2]
  const reviewScore = params[3]

  const actionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId('reviewCommentInput')
        .setLabel('What did you think of the movie?')
        .setPlaceholder('Enter reasons behind your rating here!')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true),
    )

  const modal = new ModalBuilder()
    .setCustomId(`reviewComment_modal_${movieId}_${reviewScore}`)
    .setTitle('Review Comment')
    .addComponents(actionRow)

  await interaction.showModal(modal)
}

export async function saveReview(
  interaction: SelectMenuInteraction | ModalSubmitInteraction,
) {
  let reviewComment
  const params = interaction.customId.split('_')
  const bot = interaction.client as BotClient

  await interaction.deferReply({ ephemeral: true })

  if (interaction.isModalSubmit())
    reviewComment = interaction.fields.getTextInputValue('reviewCommentInput')

  const data: Prisma.MovieReviewCreateInput = {
    movieId: params[2],
    user: {
      userId: interaction.user.id,
      username: interaction.user.username,
    },
    guildId: interaction.guildId,
    score: parseInt(params[3]),
    comment: reviewComment,
  }
  try {
    let review = await bot.db.movieReview.findFirst({
      where: { user: data.user, movieId: data.movieId, guildId: data.guildId },
    })
    let statusReply = 'Review successfully added! 🎉'

    if (review) {
      review = await bot.db.movieReview.update({
        where: { id: review.id },
        data: data,
      })
      statusReply = 'Review successfully updated!'
    } else {
      review = await bot.db.movieReview.create({ data })
    }

    const movie = await bot.movies.getById(data.movieId)

    if (!reviewComment) reviewComment = '*No comment added*'

    const reviewInfoEmbed = new EmbedBuilder()
      .setColor('#01b4e4')
      .setTitle(`${movie.title} review by ${review.user.username}`)
      .setAuthor({
        name: review.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(reviewComment)
      .setImage(movie.image)
      .addFields([
        {
          name: 'Release Date',
          value: dayjs(movie.date).format('MMMM D, YYYY'),
        },
        { name: 'Score', value: convertScoreToStars(review.score) },
      ])

    await interaction.channel.send({
      content: `<@${review.user.userId}>`,
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

export function convertScoreToStars(score: number, count?: number) {
  const suffix = count ? ` (${count})` : ''
  return '⭐️'.repeat(score) + suffix
}
