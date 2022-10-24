import { ChatInputCommandInteraction, Client, ClientOptions, Collection, SlashCommandBuilder } from 'discord.js'

export class BotClient extends Client {
  public commands: Collection<String, SlashCommand>
  constructor(options: ClientOptions) {
    super(options)
  }
}

export interface SlashCommand {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
