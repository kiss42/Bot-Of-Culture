import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'

const command = {
  data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
  execute: sendUserInfo,
}

async function sendUserInfo(interaction: ChatInputCommandInteraction) {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
  const member = interaction.member as GuildMember
  await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${member.joinedAt}.`)
}

export default command
