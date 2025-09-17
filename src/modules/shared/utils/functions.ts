import { BadRequestException } from "@nestjs/common";
import { formatInTimeZone } from "date-fns-tz";

export class GlobalFunctions {
  /**
   * Validates if a parameter is empty or malformed
   * @param param - Parameter to be validated
   * @throws HttpException - Throws a 400 Bad Request if the parameter is malformed (contains ":")
   */
  IsEmptyParam(param: string | number) {
    if (param.toString().includes(":")) throw new BadRequestException("Parâmetro malformado");
  }

  /**
   * Validates if a parameter is an array
   * @param param - Parameter to be validated
   * @throws HttpException - Throws a 400 Bad Request if the parameter is not an array
   */
  IsValidArray(param: any) {
    if (!Array.isArray(param)) throw new BadRequestException("Parâmetro malformado");
  }

  /**
   * Get the current date and time in the "America/Bahia" timezone
   * @returns Current date and time in the "America/Bahia" timezone
   */
  getCurrentDateAndTime() {
    const timeZone = "America/Bahia";

    const currentDate = new Date();
    const currentDateTimeInSaoPaulo = formatInTimeZone(
      currentDate,
      timeZone,
      "yyyy-MM-dd HH:mm:ss",
    );

    return new Date(currentDateTimeInSaoPaulo);
  }

  /**
   * Remove special characters from a document string
   * @param document - Document string to be processed
   * @returns Document string without special characters
   */
  removeSpecialCharacters(document: string) {
    return document.replace(/\D/g, "");
  }

  /**
   * Exclude specific keys from an object
   * @param obj - Object to be processed
   * @param keys - Keys to be excluded
   * @returns New object without the excluded keys
   */
  excludeFromObject<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
    ) as Omit<T, K>;
  }

  /**
   * Exclude specific keys from a list of objects
   * @param objects - List of objects to be processed
   * @param keysToDelete - Keys to be excluded
   * @returns New list of objects without the excluded keys
   */
  excludeFromList<T, K extends keyof T>(objects: T[], keysToDelete: K[]): Omit<T, K>[] {
    return objects.map((obj) => this.excludeFromObject(obj, keysToDelete));
  }

  /**
   * Checks if a value is blank (null, undefined, empty string, empty array, or empty object)
   * @param value - Value to be checked
   * @returns True if the value is blank, false otherwise
   */
  blank<T>(value: T): value is Extract<T, null | undefined | "" | [] | Record<string, never>> {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === "object" && value !== null) {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  /**
   * Checks if a value is filled (not null or undefined)
   * @param value - Value to be checked
   * @returns True if the value is filled, false otherwise
   */
  filled = <T>(value: T): value is NonNullable<T> => !this.blank(value);

  /**
   * Checks if a value is one of the specified options
   * @param value - Value to be checked
   * @param options - Array of valid options
   * @returns True if the value is one of the options, false otherwise
   */
  oneOf = <T>(value: T, options: T[]): value is T => options.includes(value);
}
