import {
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  SlashCommandBuilder,
} from 'discord.js'

export interface ActiveGame {
  id: string;
  choice: string;
}

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction | MessageComponentInteraction
  ) => Promise<void>;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}
