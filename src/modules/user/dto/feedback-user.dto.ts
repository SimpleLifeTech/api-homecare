import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class FeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string
}
