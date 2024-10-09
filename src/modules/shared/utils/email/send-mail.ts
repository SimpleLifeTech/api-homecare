import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as handlebars from "handlebars"
import * as nodemailer from "nodemailer"
import * as path from "path"
import * as process from "process"

@Injectable()
export class EmailService {
  async sendEmail(
    email: string,
    subject: string,
    payload: any,
    templateName: string,
  ): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_ACCESS_EMAIL,
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL_ACCESS_KEY,
          pass: process.env.PASS_ACCESS_KEY,
        },
      })

      const pathDevOrProd = path.join(process.cwd(), "public", "templates", `${templateName}.hbs`)

      const pathLocal = path.join(process.cwd(), "public", "templates", `${templateName}.hbs`)

      const source = fs.readFileSync(
        process.env.NODE_ENV === "local" ? pathLocal : pathDevOrProd,
        "utf8",
      )

      const compiledTemplate = handlebars.compile(source)

      const options = () => ({
        from: process.env.EMAIL_NO_REPLY,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      })

      await transporter.sendMail(options())
    } catch (error) {
      throw error
    }
  }
}
