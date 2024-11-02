import { Module } from "@nestjs/common";
import { MailService } from "./email.service";
import { MailClient } from "./email.client";

@Module({
  providers: [
    MailService,
    {
      provide: "MailProvider",
      useClass: MailClient,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
