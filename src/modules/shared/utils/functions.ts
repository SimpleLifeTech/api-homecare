import { HttpException, HttpStatus } from "@nestjs/common";

export class GlobalFunctions {
  constructor() {}

  IsEmptyParam(param: string | number) {
    const errorObject = {
      status: false,
      data: null,
      error: "Parâmetro malformado",
    };
    if (param.toString().includes(":"))
      throw new HttpException(errorObject, HttpStatus.BAD_REQUEST);
  }
}
