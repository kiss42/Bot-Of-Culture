import { NeedleOptions } from 'needle'
import { SearchResult } from '../utils/types'

export default abstract class Service {
  protected readonly headers: NeedleOptions

  constructor(protected readonly baseURL: string, token: string) {
    this.headers = { headers: { Authorization: `Bearer ${token}` } }
  }

  abstract search(query: string): Promise<SearchResult[]>;

  abstract getById(id: string): Promise<SearchResult>;
}
