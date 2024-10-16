import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { RoleRoles } from "./business/role.roles";
import { RoleRepository } from "./dao/role.repository";
import { CreateOrUpdateRoleDTO } from "./dto/create-update-role.dto";
import { RoleModel } from "@modules/models/role.model";

const response = new CoreResponse();

@Injectable()
export class RoleService extends RoleRoles {
  constructor(@Inject(RoleRepository) protected readonly roleRepository: RoleRepository) {
    super();
  }

  async createRole(data: CreateOrUpdateRoleDTO): Promise<APIResponse<string, ErrorTypes>> {
    const roleAlreadyExists = await this.roleRepository.findRoleByName(data.name);

    await this.roleAlreadyExists(roleAlreadyExists);

    await this.roleRepository.createRole(data);

    return response.success("Função criada com sucesso!", HttpStatus.CREATED);
  }

  async findRoleById(roleId: number): Promise<APIResponse<RoleModel, ErrorTypes>> {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    await this.roleNotFound(roleExists);

    return response.success(roleExists);
  }

  async findRoles(): Promise<APIResponse<RoleModel[], ErrorTypes>> {
    const roles = await this.roleRepository.findRoles();

    await this.rolesNotFound(roles);

    return response.success(roles);
  }

  async updateRoleById(
    roleId: number,
    data: CreateOrUpdateRoleDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    await this.roleNotFound(roleExists);

    await this.roleRepository.updateRoleById(roleId, data);

    return response.success("Função atualizada com sucesso!");
  }

  async inactivateRoleById(roleId: number): Promise<APIResponse<string, ErrorTypes>> {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    await this.roleNotFound(roleExists);

    await this.roleRepository.inactivateRoleById(roleId);

    return response.success("Função inativada com sucesso!");
  }
}
