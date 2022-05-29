// Dependencies
import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

// Core
import { baseResponse, IParamsRaw, IParamsContent, IBaseMailer, IBaseResponse } from '@/domain/shared'

@Injectable()
export class SMTPService implements IBaseMailer {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send E-mail method with row html
   * @param params object - Email Sending Params: { to: string, subject: string, text?: string, html: string }
   */
  public async sendRawMail(params: IParamsRaw): Promise<IBaseResponse> {
    return await new Promise<any>((resolve): any => {
      this.mailerService.sendMail({
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html
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
      this.mailerService.sendMail({
        to: params.to,
        subject: params.subject,
        template: `./${params.template}`,
        context: params.context
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
