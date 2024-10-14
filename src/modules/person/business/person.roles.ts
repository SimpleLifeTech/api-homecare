import { PersonModel } from "@modules/models/person.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class PersonRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async personNotFound(person: PersonModel) {
    this.businessErrors.addError({
      condition: !person,
      message: "Pessoa não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async personAlreadyExists(person: PersonModel) {
    this.businessErrors.addError({
      condition: !!person,
      message: "Esta pessoa já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
