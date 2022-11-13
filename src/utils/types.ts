import {
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

export interface ActiveGame {
  id: string;
  choice: string;
}

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (
    interaction: ChatInputCommandInteraction | MessageComponentInteraction,
    subCommandExecutor?: SubcommandExecutors
  ) => Promise<void>;
}

export interface SubcommandExecutors {
  [key: string]: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}
