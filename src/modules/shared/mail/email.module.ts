import { Module } from "@nestjs/common";
import { MailService } from "./email.service";
import { MailClient } from "./email.client";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [MailService, MailClient, ConfigService],
  exports: [MailService],
})
export class MailModule {}
