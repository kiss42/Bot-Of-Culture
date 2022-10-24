import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from 'src/utils/types'

const command: SlashCommand = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  execute: sendPongReply,
}

async function sendPongReply(interaction: ChatInputCommandInteraction) {
  await interaction.reply('Pong!')
}

export default command
