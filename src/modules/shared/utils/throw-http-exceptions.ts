import { HttpException, HttpStatus } from "@nestjs/common"

type EntityError = {
  entity: any
  statusCode: HttpStatus
  message: string
}

type DefaultError = {
  statusCode: HttpStatus
  message: string
}

export function throwIfAlreadyExists({ message, statusCode, entity }: EntityError) {
  if (entity) {
    throw new HttpException(message, statusCode)
  }
}

export function throwHttpError({ message, statusCode }: DefaultError) {
  throw new HttpException(message, statusCode)
}
