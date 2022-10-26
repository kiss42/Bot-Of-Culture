import {
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  MessageComponentInteraction,
  SlashCommandBuilder,
} from 'discord.js'

export interface ActiveGame {
  id: string
  choice: string
}
export class BotClient extends Client {
  public commands: Collection<String, SlashCommand>
  public activeGames: { [userId: string]: ActiveGame }
  constructor(options: ClientOptions) {
    super(options)
    this.activeGames = {}
  }
}

export interface SlashCommand {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction | MessageComponentInteraction) => Promise<void>
}
