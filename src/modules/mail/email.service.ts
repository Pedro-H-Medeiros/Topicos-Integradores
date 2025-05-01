import { Inject, Injectable } from '@nestjs/common'
import nodemailer, { SentMessageInfo } from 'nodemailer'

import { EmailProvider } from './email.provider'

interface EmailHandler {
  email: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailService {
  constructor(
    @Inject(EmailProvider.provide)
    private readonly emailProvider: nodemailer.Transporter<SentMessageInfo>,
  ) {}

  async handler({ email, subject, text, html }: EmailHandler) {
    await this.emailProvider.sendMail({
      to: email,
      subject,
      text,
      html,
    })
  }
}
