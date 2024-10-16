import { RolePermissionModel } from "@modules/models/role-permission.model";
import { RoleRoles } from "@modules/role/business/role.roles";
import { RoleRepository } from "@modules/role/dao/role.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { RolePermissionRoles } from "./business/role-permission.roles";
import { RolePermissionRepository } from "./dao/role-permission.repository";
import { CreateRolePermissionDTO } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionDTO } from "./dto/update-role-permission.dto";

const response = new CoreResponse();

@Injectable()
export class RolePermissionService extends RolePermissionRoles {
  constructor(
    @Inject(RolePermissionRepository)
    private readonly rolePermissionRepository: RolePermissionRepository,
    @Inject(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly roleRoles: RoleRoles,
  ) {
    super();
  }

  async createRolePermission(
    roleId: number,
    data: CreateRolePermissionDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    await this.roleRoles.roleNotFound(roleExists);

    const rolePermissionAlreadyExists =
      await this.rolePermissionRepository.findRolePermissionByRoleId(roleId);

    await this.rolePermissionAlreadyExists(rolePermissionAlreadyExists);

    await this.rolePermissionRepository.createRolePermission(roleId, data);

    return response.success("Permissão criada com sucesso!", HttpStatus.CREATED);
  }

  async findRolePermissionById(
    rolePermissionId: string,
  ): Promise<APIResponse<RolePermissionModel, ErrorTypes>> {
    const rolePermissionExists =
      await this.rolePermissionRepository.findRolePermissionById(rolePermissionId);

    await this.rolePermissionNotFound(rolePermissionExists);

    return response.success(rolePermissionExists);
  }

  async updateFunctionPermissionById(
    rolePermissionId: string,
    data: UpdateRolePermissionDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const rolePermissionExists =
      await this.rolePermissionRepository.findRolePermissionById(rolePermissionId);

    await this.rolePermissionNotFound(rolePermissionExists);

    await this.rolePermissionRepository.updateRolePermissionById(rolePermissionId, data);

    return response.success("Permissão atualizada com sucesso!");
  }

  async inactivateFunctionPermissionById(
    rolePermissionId: string,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const rolePermissionExists =
      await this.rolePermissionRepository.findRolePermissionById(rolePermissionId);

    await this.rolePermissionNotFound(rolePermissionExists);

    await this.rolePermissionRepository.inactivateRolePermissionById(rolePermissionId);

    return response.success("Permissão desativada com sucesso!");
  }
}
