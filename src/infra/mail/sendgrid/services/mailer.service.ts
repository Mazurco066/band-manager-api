// Dependencies
import { Injectable } from '@nestjs/common'
import { options } from '@/main/config'
import sgMail from '@sendgrid/mail'

// Core
import { baseResponse, IParamsRaw, IParamsContent, IBaseMailer, IBaseResponse } from '@/domain/shared'

@Injectable()
export class SendGridService implements IBaseMailer {
  constructor() {
    sgMail.setApiKey(options.SENDGRID_KEY)
  }

  /**
   * Send E-mail method with row html
   * @param params object - Email Sending Params: { to: string, subject: string, text?: string, html: string }
   */
  public async sendRawMail(params: IParamsRaw): Promise<IBaseResponse> {
    return await new Promise<any>((resolve): any => {
      sgMail.send({
        from: options.SENDGRID_SENDER,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text
      })
      .then(() => resolve(
        baseResponse(200, 'E-mail successfully sent!')
      ))
      .catch(e => resolve(
        baseResponse(500, `Error while sending E-mail: ${e.message}`)
      ))
    })
  }

  /**
   * Send E-mail method with contexts variables
   * @param params object - Email Sending Params: { to: string, subject: string, template: string, context?: any }
   */
  public async sendTemplateMail(params: IParamsContent): Promise<IBaseResponse> {
    return await new Promise<any>((resolve): any => {
      sgMail.send({
        from: options.SENDGRID_SENDER,
        to: params.to,
        subject: params.subject,
        templateId: params.template,
        dynamicTemplateData: { ...params.context }
      })
      .then(() => resolve(
        baseResponse(200, 'E-mail successfully sent!')
      ))
      .catch(e => {
        console.log(e)
        resolve(
          baseResponse(500, `Error while sending E-mail: ${e.message}`)
        )
      } )
    })
  }
}
