// Filter
import { IBaseResponse } from './base-response'

export interface IParamsRaw {
  to: string
  subject: string
  text?: string
  html: string
}

export interface IParamsContent {
  to: string
  subject: string
  template: string
  context?: any
}

/**
 * @description define interface for default mailer service.
 *
 * @example
 *    constructor() {}
 *
 * @description Methods to implement
 * @method sendRawMail
 * @method sendTemplateMail
 */
export interface IBaseMailer {
  /**
   * @param params as `IParamsContent`
   * @returns Promise with `IBaseResponse` type
   */
   sendRawMail: (params: IParamsRaw) => Promise<IBaseResponse>
  /**
   * @param params as `IParamsContent`
   * @returns Promise with `IBaseResponse` type
   */
   sendTemplateMail: (params: IParamsContent) => Promise<IBaseResponse>
}
