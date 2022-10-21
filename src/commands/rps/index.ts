import { ChatInputCommandInteraction } from 'discord.js'
import { createCommandChoices } from './utils'

export const rpsCommands = [
  {
    name: 'challenge',
    description: 'Challenge to a match of rock paper scissors',
    options: [
      {
        type: 3,
        name: 'object',
        description: 'Pick your object',
        required: true,
        choices: createCommandChoices(),
      },
    ],
    type: 1,
  },
]

export function sendGameInvite(activeGames: any, interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id
  const choice = interaction.options.data[0].value

  activeGames[interaction.id] = {
    id: userId,
    choice,
  }

  interaction.reply(`Thanks for selecting ${choice}. We're still working on what to do with it`)
}
