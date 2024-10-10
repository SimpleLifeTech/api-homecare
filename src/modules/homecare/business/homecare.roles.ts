import { HomecareModel } from "@modules/models/homecare";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class HomecareRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async homecaresNotFound(homecares: HomecareModel[]) {
    this.businessErrors.addError({
      condition: !homecares || homecares.length === 0,
      message: "Homecares não encontrados!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async homecareNotFound(homecare: HomecareModel) {
    this.businessErrors.addError({
      condition: !homecare,
      message: "Homecare não encontrado!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async homecareAlreadyExists(homecare: HomecareModel) {
    this.businessErrors.addError({
      condition: !!homecare,
      message: "Este homecare já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
