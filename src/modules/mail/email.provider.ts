import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
})

export const EmailProvider = {
  provide: 'SEND_EMAIL_PROVIDER',
  useValue: transporter,
}
