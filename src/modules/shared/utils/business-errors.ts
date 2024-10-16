import { HttpException, HttpStatus } from "@nestjs/common";

export interface IBusinessError {
  condition: boolean;
  message: string;
  statusCode: HttpStatus;
  messageCode?: string;
}
export class BusinessErrors {
  constructor(
    private message?: string,
    private canThrow?: boolean,
    private statusCode?: HttpStatus,
    private messageCode?: string,
  ) {
    this.message = "";
    this.canThrow = false;
    this.statusCode = null;
    this.messageCode = "";
  }

  public addError(businessError: IBusinessError) {
    if (businessError.condition) {
      this.canThrow = businessError.condition;
      this.message = businessError.message;
      this.statusCode = businessError.statusCode;
      this.messageCode = businessError.messageCode;
    }

    this.throwErrors();
  }

  public clearErrors() {
    this.message = "";
  }

  public throwErrors() {
    if (this.canThrow && this.message.length && this.statusCode) {
      const errorObject = {
        status: false,
        data: null,
        error: this.message,
      };
      throw new HttpException(errorObject, this.statusCode);
    }
  }
}
