import {
  ActionRowBuilder,
  APISelectMenuOption,
  SelectMenuBuilder,
  SelectMenuInteraction,
} from 'discord.js'

const command = {
  data: { name: 'reviewScore' },
  execute: reviewScore,
}

const replyOptions: APISelectMenuOption[] = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
]

async function reviewScore(interaction: SelectMenuInteraction) {
  const movieId = interaction.customId.replace('reviewScore_button_', '')
  const score = interaction.values[0]

  const actionRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId(`addComment_button_${movieId}_${score}`)
      .addOptions(...replyOptions),
  )

  await interaction.update({
    content:
      'Thanks for the rating! Would you like to leave a comment explaining your score?',
    components: [actionRow as any],
  })
}

export default command
