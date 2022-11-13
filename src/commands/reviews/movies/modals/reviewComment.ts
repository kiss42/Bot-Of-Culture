import { ModalSubmitInteraction } from 'discord.js'
import { saveReview } from '../utils'

const command = {
  data: { name: 'reviewComment' },
  execute: handleReviewComment,
}

async function handleReviewComment(interaction: ModalSubmitInteraction) {
  await saveReview(interaction)
}

export default command
