import { SelectMenuInteraction } from 'discord.js'
import { promptReviewComment, saveReview } from '../utils'

const command = {
  data: { name: 'addComment' },
  execute: addComment,
}

async function addComment(interaction: SelectMenuInteraction) {
  const reply = interaction.values[0]

  if (reply === 'yes') await promptReviewComment(interaction)
  else await saveReview(interaction)
}

export default command
