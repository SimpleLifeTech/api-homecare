import { RoleRepository } from "@modules/role/dao/role.repository";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { RolePermissionRepository } from "./dao/role-permission.repository";
import { CreateRolePermissionDTO } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionDTO } from "./dto/update-role-permission.dto";

const { blank, filled } = new GlobalFunctions();
@Injectable()
export class RolePermissionService {
  constructor(
    @Inject(RolePermissionRepository)
    private readonly rolePermissionRepository: RolePermissionRepository,
    @Inject(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  async createRolePermission(roleId: number, data: CreateRolePermissionDTO) {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    if (blank(roleExists)) throw new BadRequestException("Função não encontrada.");

    const rolePermissionAlreadyExists =
      await this.rolePermissionRepository.findRolePermissionByRoleId(roleId);

    if (filled(rolePermissionAlreadyExists))
      throw new BadRequestException("Esta Permissão já existe.");

    await this.rolePermissionRepository.createRolePermission(roleId, data);

    return "Permissão criada com sucesso!";
  }

  async findRolePermissionById(rolePermissionId: string) {
    return this.rolePermissionNotFound(rolePermissionId);
  }

  async updateFunctionPermissionById(rolePermissionId: string, data: UpdateRolePermissionDTO) {
    await this.rolePermissionNotFound(rolePermissionId);
    await this.rolePermissionRepository.updateRolePermissionById(rolePermissionId, data);
    return "Permissão atualizada com sucesso!";
  }

  async inactivateFunctionPermissionById(rolePermissionId: string) {
    await this.rolePermissionNotFound(rolePermissionId);
    await this.rolePermissionRepository.inactivateRolePermissionById(rolePermissionId);
    return "Permissão desativada com sucesso!";
  }

  private async rolePermissionNotFound(rolePermissionId: string) {
    const rolePermissionExists =
      await this.rolePermissionRepository.findRolePermissionById(rolePermissionId);

    if (blank(rolePermissionExists)) throw new BadRequestException("Permissão não encontrada.");

    return rolePermissionExists;
  }
}
