import { PrismaClient } from '@prisma/client'
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
  public db: PrismaClient
  constructor(options: ClientOptions) {
    super(options)
    this.initDatabase()
  }

  async initDatabase() {
    // Init database
    try {
      this.db = new PrismaClient()
      await this.db.$connect()
      console.log('Database connected!')
    } catch (error) {
      console.error('Something went wrong connected to the database')
    }
  }
}

export interface SlashCommand {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction | MessageComponentInteraction) => Promise<void>
}
