import nodemailer from 'nodemailer'
import { resolve } from 'path'
import exphbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'
import mailConfig from '../config/mailer'

class Email {
  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      })
      this.client = transporter
      this.configureTemplates()
    })
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'views')

    this.client.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      }),
    )
  }

  async sendMail({ to, subject, from, template }) {
    const message = await this.client.sendMail({
      from: from || mailConfig.default.from,
      to,
      subject,
      template,
    })
    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

export default new Email()
