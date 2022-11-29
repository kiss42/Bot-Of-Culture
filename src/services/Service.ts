import { NeedleOptions } from 'needle'
import { SearchResult } from '../utils/types'

export default abstract class Service {
  protected readonly baseURL: string
  protected readonly headers: NeedleOptions

  protected constructor(baseURL: string, token: string) {
    this.baseURL = baseURL
    this.headers = { headers: { Authorization: `Bearer ${token}` } }
  }

  abstract search(query: string): Promise<SearchResult[]>

  abstract getById(id: string): Promise<SearchResult>
}
