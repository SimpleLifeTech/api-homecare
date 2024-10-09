import { HttpStatus } from "@nestjs/common";

export type ErrorTypes = string | unknown | null;

export type APIResponse<Data, Error> = {
  status: boolean;
  data: Data;
  error: Error;
  codeHttp: number;
};

/**
 * CoreResponse class provides methods to create success and error responses.
 */
export class CoreResponse {
  /**
   * Creates a success response.
   * @template Data The type of the data in the response.
   * @param {Data} data The data to include in the response.
   * @param {number} codeHttp The HTTP status code to include in the response.
   * @returns {CoreResponseType<Data>} The success response object.
   */
  success<Data>(data: Data, codeHttp?: number): APIResponse<Data, null> {
    return {
      status: true,
      data,
      error: null,
      codeHttp: codeHttp ?? HttpStatus.OK,
    };
  }

  /**
   * Creates a general error response.
   * @template Error The type of the error in the response.
   * @param {Error} error The error to include in the response.
   * @param {number} codeHttp The HTTP status code to include in the response.
   * @returns {CoreResponseType<Error>} The general error response object.
   */
  unsuccessfully<Error>(error: Error, codeHttp?: number): APIResponse<null, Error> {
    return {
      status: true,
      data: null,
      error,
      codeHttp: codeHttp ?? HttpStatus.BAD_REQUEST,
    };
  }

  /**
   * Creates an error response.
   * @template Error The type of the error in the response.
   * @param {any} error The error to include in the response.
   * @returns {CoreResponseType<null, Error>} The error response object.
   */
  error<Error>(error: any): APIResponse<null, Error> {
    console.error(error);

    return {
      status: false,
      data: null,
      error,
      codeHttp: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
