import { PrismaClient } from '@prisma/client'
import { Client, ClientOptions, Collection } from 'discord.js'
import MovieService from './services/MovieService'
import { CollectionName, SlashCommand } from './utils/types'

export class BotClient extends Client {
  public commands: Collection<string, SlashCommand>
  public db: PrismaClient
  public movies: MovieService

  constructor(options: ClientOptions) {
    super(options)
    this.initDatabase().then(() => {
      this.movies = new MovieService()
    })
  }

  getCollection(name: CollectionName) {
    const collections = {
      movie: this.db.movieReview,
      series: this.db.seriesReview,
    }

    return collections[name]
  }

  private async initDatabase() {
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
