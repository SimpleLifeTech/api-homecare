interface MailResponse {
  status: boolean;
  message: string;
}

export interface MailProvider {
  sendEmail(to: string, subject: string, text: string): Promise<MailResponse>;
}
