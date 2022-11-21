import { MessageComponentInteraction } from 'discord.js'
import { promptReview } from '../utils'

const command = {
  data: { name: 'startReview' },
  execute: handleReview,
}

async function handleReview(interaction: MessageComponentInteraction) {
  await promptReview(interaction)
}

export default command
