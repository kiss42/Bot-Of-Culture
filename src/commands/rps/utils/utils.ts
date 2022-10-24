import { APIApplicationCommandOptionChoice } from 'discord.js'
import { RPSChoices } from './choices'

// Get the game choices from game.js
export function createCommandChoices(): APIApplicationCommandOptionChoice<string>[] {
  const choices = getRPSChoices()
  const commandChoices = []

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    })
  }

  return commandChoices
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getRPSChoices() {
  return Object.keys(RPSChoices)
}
