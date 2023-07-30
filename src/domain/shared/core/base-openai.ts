// Dependencies
import { IBaseResponse } from './base-response'

/**
 * @description define interface for default openai service.
 *
 * @example constructor() {}
 * @description Methods to implement
 * @method formatText
 */
export interface IBaseOpenAI {
  /**
   * @param text as `String`
   * @returns Promise with `IBaseResponse` type
   */
   formatText: (text: string) => Promise<IBaseResponse>
}
