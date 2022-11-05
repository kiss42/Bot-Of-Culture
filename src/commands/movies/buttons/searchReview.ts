import { MessageComponentInteraction } from 'discord.js'
import { BotClient } from 'src/Bot'
import { MovieReview } from '@prisma/client'
import { createReviewEmbed } from '../utils'

const commands = {
  data: { name: 'searchMovieReview' },
  execute: getMovieReview,
}

async function getMovieReview(interaction: MessageComponentInteraction) {
  const bot = interaction.client as BotClient
  const params = interaction.customId.split('_')
  const movieId = params[3]
  const userId = params[1]
  const guildId = interaction.guildId

  await interaction.deferUpdate()

  const review: MovieReview = await bot.db.movieReview.findFirst({
    where: { guildId, movieId, userId },
  })

  if (review) {
    const movieInfo = await bot.movies.getById(review.movieId)
    const userAvatar = bot.guilds
      .resolve(guildId)
      .members.resolve(userId)
      .user.avatarURL()
    const reviewEmbed = createReviewEmbed(review, movieInfo, userAvatar)
    interaction.channel.send({
      content: `Review requested by <@${interaction.user.id}>`,
      embeds: [reviewEmbed as any],
    })
    await interaction.editReply({
      content: 'Review successfully found! 🤓',
      components: [],
    })
  } else {
    await interaction.editReply({
      content: 'Sorry, no review of that movie was found for that user.',
      components: [],
    })
  }
}

export default commands
