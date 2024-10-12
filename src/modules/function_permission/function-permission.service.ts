import { FunctionRoles } from "@modules/function/business/function.roles";
import { FunctionRepository } from "@modules/function/dao/function.repository";
import { FunctionPermissionModel } from "@modules/models/function-permission.model";
import { HttpStatus } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { FunctionPermissionRoles } from "./business/function-permission.roles";
import { FunctionPermissionRepository } from "./dao/function-permission.repository";
import { CreateFunctionPermissionDTO } from "./dto/create-function-permission.dto";
import { UpdateFunctionPermissionDTO } from "./dto/update-function-permission.dto";

export class FunctionPermissionService extends FunctionPermissionRoles {
  constructor(
    private readonly functionPermissionRepository: FunctionPermissionRepository,
    private readonly functionRepository: FunctionRepository,
    private readonly functionRoles: FunctionRoles,
    private readonly response = new CoreResponse(),
  ) {
    super();
  }

  async createFunctionPermission(
    functionId: number,
    data: CreateFunctionPermissionDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const functionExists = await this.functionRepository.findFunctionById(functionId);

    await this.functionRoles.functionNotFound(functionExists);

    const functionPermissionAlreadyExists =
      await this.functionPermissionRepository.findFunctionPermissionByFunctionId(functionId);

    await this.functionPermissionAlreadyExists(functionPermissionAlreadyExists);

    await this.createFunctionPermission(functionId, data);

    return this.response.success("Permissão criada com sucesso!", HttpStatus.CREATED);
  }

  async findFunctionPermissionById(
    functionPermissionId: string,
  ): Promise<APIResponse<FunctionPermissionModel, ErrorTypes>> {
    const functionPermissionExists =
      await this.functionPermissionRepository.findFunctionPermissionById(functionPermissionId);

    await this.functionPermissionNotFound(functionPermissionExists);

    return this.response.success(functionPermissionExists);
  }

  async updateFunctionPermissionById(
    functionPermissionId: string,
    data: UpdateFunctionPermissionDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const functionPermissionExists =
      await this.functionPermissionRepository.findFunctionPermissionById(functionPermissionId);

    await this.functionPermissionNotFound(functionPermissionExists);

    await this.functionPermissionRepository.updateFunctionPermissionById(
      functionPermissionId,
      data,
    );

    return this.response.success("Permissão atualizada com sucesso!");
  }

  async inactivateFunctionPermissionById(
    functionPermissionId: string,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const functionPermissionExists =
      await this.functionPermissionRepository.findFunctionPermissionById(functionPermissionId);

    await this.functionPermissionNotFound(functionPermissionExists);

    await this.functionPermissionRepository.inactivateFunctionPermissionById(functionPermissionId);

    return this.response.success("Permissão desativada com sucesso!");
  }
}
