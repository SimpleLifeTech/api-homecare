import { FunctionPermissionModel } from "@modules/models/function-permission.model";
import { DataSource, UpdateResult } from "typeorm";
import { CreateFunctionPermissionDTO } from "../dto/create-function-permission.dto";

export class FunctionPermissionRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(FunctionPermissionModel);

  async createFunctionPermission(
    functionId: number,
    data: CreateFunctionPermissionDTO,
  ): Promise<FunctionPermissionModel> {
    return this.repository.save({ function_id: functionId, ...data });
  }

  async findFunctionPermissionById(functionPermissionId: string): Promise<FunctionPermissionModel> {
    return this.repository.findOneBy({ id: functionPermissionId });
  }

  async findFunctionPermissionByFunctionId(functionId: number): Promise<FunctionPermissionModel> {
    return this.repository.findOneBy({ function_id: functionId });
  }

  async updateFunctionPermissionById(
    functionPermissionId: string,
    data: CreateFunctionPermissionDTO,
  ): Promise<UpdateResult> {
    return this.repository.update({ id: functionPermissionId }, data);
  }

  async inactivateFunctionPermissionById(functionPermissionId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: functionPermissionId });
  }
}
