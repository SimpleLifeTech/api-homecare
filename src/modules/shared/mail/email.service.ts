import { Injectable } from "@nestjs/common";
import { MailProvider } from "./email.type";

@Injectable()
export class MailService {
  constructor(private readonly mailProvider: MailProvider) {}

  async sendConfirmationEmail(to: string, validationCode: string) {
    const subject = "Confirmação de Pagamento";
    const text = `Obrigado pelo pagamento! Seu código de validação é: ${validationCode}.`;
    await this.mailProvider.sendEmail(to, subject, text);
  }

  async sendPasswordRecoveryEmail(to: string, resetToken: string) {
    const subject = "Recuperação de Senha";
    const text = `Use este token para redefinir sua senha: ${resetToken}.`;
    await this.mailProvider.sendEmail(to, subject, text);
  }

  async sendPlanExpiryNotification(to: string) {
    const subject = "Seu plano expirou";
    const text = "Seu plano expirou. Por favor, renove para continuar utilizando o serviço.";
    await this.mailProvider.sendEmail(to, subject, text);
  }
}
