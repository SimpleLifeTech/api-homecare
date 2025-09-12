import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sgMail from "@sendgrid/mail";

import { MailProvider } from "./email.type";

@Injectable()
export class MailClient implements MailProvider {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>("SENDGRID_API_KEY"));
  }

  async sendEmail(to: string, subject: string, content: string) {
    const msg = {
      to,
      from: this.configService.get<string>("SENDGRID_SENDER"),
      subject,
      html: content,
    };

    let status: boolean;
    let message: string;

    await sgMail
      .send(msg)
      .then(() => {
        console.log("E-mail sent");
        status = true;
        message = "E-mail enviado com sucesso!";
      })
      .catch((error) => {
        console.error(error);
        status = false;
        message = "Erro ao enviar e-mail";
      });

    return { status, message };
  }
}
