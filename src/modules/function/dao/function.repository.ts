import { FunctionModel } from "@modules/models/function.model";
import { DataSource, UpdateResult } from "typeorm";
import { CreateOrUpdateFunctionDTO } from "../dto/create-update-function.dto";

export class FunctionRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(FunctionModel);

  async createFunction(data: CreateOrUpdateFunctionDTO): Promise<FunctionModel> {
    return this.repository.save(data);
  }

  async findFunctionByName(name: string): Promise<FunctionModel> {
    return this.repository.findOneBy({ name });
  }

  async findFunctionById(functionId: number): Promise<FunctionModel> {
    return this.repository.findOneBy({ id: functionId });
  }

  async findFunctions(): Promise<FunctionModel[]> {
    return this.repository.find();
  }

  async updateFunctionById(
    functionId: number,
    data: CreateOrUpdateFunctionDTO,
  ): Promise<UpdateResult> {
    return this.repository.update({ id: functionId }, data);
  }

  async inactivateFunctionById(functionId: number): Promise<UpdateResult> {
    return this.repository.softDelete({ id: functionId });
  }
}
