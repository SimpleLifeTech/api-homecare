import { FunctionModel } from "@modules/models/function.model";
import { HttpStatus } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { FunctionRoles } from "./business/function.roles";
import { FunctionRepository } from "./dao/function.repository";
import { CreateOrUpdateFunctionDTO } from "./dto/create-update-function.dto";

export class FunctionService extends FunctionRoles {
  constructor(
    protected readonly functionRepository: FunctionRepository,
    protected readonly response = new CoreResponse(),
  ) {
    super();
  }

  async createFunction(data: CreateOrUpdateFunctionDTO): Promise<APIResponse<string, ErrorTypes>> {
    const functionAlreadyExists = await this.functionRepository.findFunctionByName(data.name);

    await this.functionAlreadyExists(functionAlreadyExists);

    await this.createFunction(data);

    return this.response.success("Função criada com sucesso!", HttpStatus.CREATED);
  }

  async findFunctionById(functionId: number): Promise<APIResponse<FunctionModel, ErrorTypes>> {
    const functionExists = await this.functionRepository.findFunctionById(functionId);

    await this.functionNotFound(functionExists);

    return this.response.success(functionExists);
  }

  async findFunctions(): Promise<APIResponse<FunctionModel[], ErrorTypes>> {
    const functions = await this.functionRepository.findFunctions();

    await this.functionsNotFound(functions);

    return this.response.success(functions);
  }

  async updateFunctionById(
    functionId: number,
    data: CreateOrUpdateFunctionDTO,
  ): Promise<APIResponse<FunctionModel, ErrorTypes>> {
    const functionExists = await this.functionRepository.findFunctionById(functionId);

    await this.functionNotFound(functionExists);

    await this.updateFunctionById(functionId, data);

    return this.response.success(functionExists);
  }

  async inactivateFunctionById(
    functionId: number,
  ): Promise<APIResponse<FunctionModel, ErrorTypes>> {
    const functionExists = await this.functionRepository.findFunctionById(functionId);

    await this.functionNotFound(functionExists);

    await this.inactivateFunctionById(functionId);

    return this.response.success(functionExists);
  }
}
