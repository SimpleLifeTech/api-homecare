import { HttpException, HttpStatus } from "@nestjs/common";
import { formatInTimeZone } from "date-fns-tz";

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

  getCurrentDateAndTime() {
    const timeZone = "America/Sao_Paulo";

    const currentDate = new Date();
    const currentDateTimeInSaoPaulo = formatInTimeZone(
      currentDate,
      timeZone,
      "yyyy-MM-dd HH:mm:ss",
    );

    return new Date(currentDateTimeInSaoPaulo);
  }

  removeSpecialCharacters(document: string) {
    return document.replace(/\D/g, "");
  }

  excludeFromObject<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
    ) as Omit<T, K>;
  }

  excludeFromList<T, K extends keyof T>(objects: T[], keysToDelete: K[]): Omit<T, K>[] {
    return objects.map((obj) => this.excludeFromObject(obj, keysToDelete)) as Omit<T, K>[];
  }
}
