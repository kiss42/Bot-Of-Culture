import dotenv from 'dotenv'
import needle, { BodyData, NeedleOptions } from 'needle'
import { SearchResult } from '../utils/types'

dotenv.config()

export default class GameServiceWrapper {
  private authHeader: { Authorization: string }
  private headers: NeedleOptions
  private baseURL: string

  constructor() {
    const token = process.env.GAME_TOKEN ?? ''
    if (!token) throw new Error('Missing IGDB API Authorization token')

    this.authHeader = { Authorization: `Bearer ${token}` }
    this.headers = { headers: this.authHeader }
    this.baseURL = ' https://api.igdb.com/v4'
  }

  async search(query: string): Promise<SearchResult[]> {
    const endpoint = `${this.baseURL}/search/game`
    const params: BodyData = { query }

    const results: Array<any> = await needle(
      'get',
      endpoint,
      params,
      this.headers,
    )
      .then((response) => {
        if (response.body.error) throw new Error(response.body.error)
        return response.body.results
      })
      .catch((err) => {
        throw err
      })
       // Get first three results
    return results.slice(0, 5).map((result) => ({
        id: result.id.toString(),
        title: result.title,
        description: result.overview,
        image: `https://api.igdb.com/v4/games/${result.poster_path}`,
        date: result.release_date,
      }))
  }
}
