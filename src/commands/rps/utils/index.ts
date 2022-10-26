import { APIApplicationCommandOptionChoice } from 'discord.js'
import { ActiveGame } from 'src/utils/types'
import { RPSChoices } from './choices'

interface Result {
  win: ActiveGame
  lose: ActiveGame
  verb: string
}

export function getResult(p1: ActiveGame, p2: ActiveGame) {
  let gameResult
  if (RPSChoices[p1.choice] && RPSChoices[p1.choice][p2.choice]) {
    // o1 wins
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.choice][p2.choice],
    }
  } else if (RPSChoices[p2.choice] && RPSChoices[p2.choice][p1.choice]) {
    // o2 wins
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.choice][p1.choice],
    }
  } else {
    // tie -- win/lose don't
    gameResult = { win: p1, lose: p2, verb: 'tie' }
  }

  return formatResult(gameResult)
}

function formatResult(result: Result) {
  const { win, lose, verb } = result
  return verb === 'tie'
    ? `<@${win.id}> and <@${lose.id}> draw with **${win.choice}**`
    : `<@${win.id}>'s **${win.choice}** ${verb} <@${lose.id}>'s **${lose.choice}**`
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨']
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

// Get the game choices from game.js
export function createCommandChoices(): APIApplicationCommandOptionChoice<string>[] {
  const choices = getRPSChoices()
  const commandChoices = []

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
      description: RPSChoices[choice]['description'],
    })
  }

  return commandChoices
}

// Function to fetch shuffled options for select menu
export function getShuffledOptions(): APIApplicationCommandOptionChoice<string>[] {
  return createCommandChoices().sort(() => Math.random() - 0.5)
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getRPSChoices() {
  return Object.keys(RPSChoices)
}
