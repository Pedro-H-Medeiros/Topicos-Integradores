import { Env } from '@/env'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import nodemailer, { SentMessageInfo } from 'nodemailer'

interface EmailHandler {
  email: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>

  constructor(private config: ConfigService<Env, true>) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST', { infer: true }),
      port: 465,
      auth: {
        user: config.get('MAIL_USER', { infer: true }),
        pass: config.get('MAIL_PASSWORD', { infer: true }),
      },
    })
  }

  async handler({ email, subject, text, html }: EmailHandler) {
    await this.transporter.sendMail({
      to: email,
      subject,
      text,
      html,
    })
  }
}
