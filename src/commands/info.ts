import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  User,
} from 'discord.js'
import { SlashCommand, SubcommandExecutors } from '../utils/types'
import { toNormalDate } from '../utils/helpers'
import { handleSubcommand } from './utils/helpers'

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or server!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Provides information about a user.')
        .addUserOption((option) =>
          option.setName('target').setDescription('The User'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('server')
        .setDescription('Provides information about the server.'),
    ),
  execute: (interaction: ChatInputCommandInteraction) =>
    handleSubcommand(interaction, subcommandExecutors),
}

const subcommandExecutors: SubcommandExecutors = {
  user: displayUserInfo,
  server: displayServerInfo,
}

async function displayUserInfo(interaction: ChatInputCommandInteraction) {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
  const target: User = interaction.options.getUser('target')
  const member: GuildMember = target
    ? await interaction.guild.members.fetch(target.id)
    : (interaction.member as GuildMember)

  await interaction.reply(
    `**${member.user.username}** joined on *${toNormalDate(
      member.joinedTimestamp,
    )}*.\nThey have been on Discord since *${toNormalDate(
      member.user.createdTimestamp,
    )}*`,
  )
}

async function displayServerInfo(interaction: ChatInputCommandInteraction) {
  // interaction.guild is the object representing the Guild in which the command was run
  await interaction.reply(
    `This server is *${interaction.guild.name}* and has *${
      interaction.guild.memberCount
    } members*\nIt was first created ${toNormalDate(
      interaction.guild.createdTimestamp,
    )}
    `,
  )
}

export default command
