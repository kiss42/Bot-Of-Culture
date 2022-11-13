import dotenv from 'dotenv'
import needle, { BodyData, NeedleOptions } from 'needle'
import { SearchResult } from 'src/utils/types'

dotenv.config()

export default class MovieServiceWrapper {
  private authHeader: { Authorization: string }
  private headers: NeedleOptions
  private baseURL: string

  constructor() {
    const token = process.env.MOVIE_TOKEN ?? ''
    if (!token) throw new Error('Missing TMDB API Authorization token')

    this.authHeader = { Authorization: `Bearer ${token}` }
    this.headers = { headers: this.authHeader }
    this.baseURL = 'https://api.themoviedb.org/3'
  }

  async search(query: string): Promise<SearchResult[]> {
    const endpoint = `${this.baseURL}/search/movie`
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
      image: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${result.poster_path}`,
      date: result.release_date,
    }))
  }

  async getById(id: string): Promise<SearchResult> {
    const endpoint = `${this.baseURL}/movie/${id}`

    const result: any = await needle('get', endpoint, null, this.headers)
      .then((response) => response.body)
      .catch((err) => {
        throw err
      })

    // Extract the only info we care about
    return {
      id: result.id.toString(),
      title: result.title,
      description: result.overview,
      image: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${result.poster_path}`,
      date: result.release_date,
    }
  }
}
