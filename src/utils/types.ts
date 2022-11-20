import {
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

export interface ActiveGame {
  id: string
  choice: string
}

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder
  execute: (
    interaction: ChatInputCommandInteraction | MessageComponentInteraction,
    subCommandExecutor?: SubcommandExecutors,
  ) => Promise<void>
}

export interface SubcommandExecutors {
  [key: string]: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export interface IReview {
  id: string
  guildId: string
  score: number
  comment?: string
  userId: string
  username: string
  createdAt: Date
}

export interface IMovieReview extends IReview {
  movieId: string
}

export interface ISeriesReview extends IReview {
  seriesId: string
}

export interface SearchResult {
  id: string
  title: string
  description: string
  image: string
  date: string
}

export interface SeriesSearchResult extends SearchResult {
  lastAirDate: string
  episodes: string
  episodeLength: string
  seasons: string
  status: string
}
