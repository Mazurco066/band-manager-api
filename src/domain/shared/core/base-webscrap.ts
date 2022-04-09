// Dependencies
import { IBaseResponse } from './base-response'

/**
 * @description define interface for default webscraopíng service.
 *
 * @example constructor() {}
 * @description Methods to implement
 * @method scrapSong
 */
export interface IBaseWebscrap {
  /**
   * @param url as `String`
   * @returns Promise with `IBaseResponse` type
   */
   scrapCifraClubSong: (url: string) => Promise<IBaseResponse>

   /**
   * @param url as `String`
   * @returns Promise with `IBaseResponse` type
   */
    scrapCifrasSong: (url: string) => Promise<IBaseResponse>
}
