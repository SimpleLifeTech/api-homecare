import { BadRequestException, ParseUUIDPipeOptions } from "@nestjs/common"

export const uuidOptions = {
  version: "4",
  exceptionFactory: () => {
    return new BadRequestException("uuid_incorrect_format")
  },
} as ParseUUIDPipeOptions
