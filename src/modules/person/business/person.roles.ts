import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

import { Person } from "../types/person.types";

@Injectable()
export class PersonRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async personNotFound(person: Person) {
    this.businessErrors.addError({
      condition: !person,
      message: "Pessoa não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async personAlreadyExists(person: Person) {
    this.businessErrors.addError({
      condition: !!person,
      message: "Esta pessoa já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async passwordNotCreated(hash: string) {
    this.businessErrors.addError({
      condition: !hash,
      message: "Senha não foi criada corretamente!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
