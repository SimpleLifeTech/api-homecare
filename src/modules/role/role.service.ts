import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { RoleRepository } from "./dao/role.repository";
import { CreateOrUpdateRoleDTO } from "./dto/create-update-role.dto";

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class RoleService {
  constructor(@Inject(RoleRepository) protected readonly roleRepository: RoleRepository) {}

  async createRole(data: CreateOrUpdateRoleDTO) {
    const roleAlreadyExists = await this.roleRepository.findRoleByName(data.name);

    if (filled(roleAlreadyExists)) throw new BadRequestException("Esta função já existe.");

    await this.roleRepository.createRole(data);

    return "Função criada com sucesso!";
  }

  async findRoleById(roleId: number) {
    return await this.roleNotFound(roleId);
  }

  async findRoles() {
    const roles = await this.roleRepository.findRoles();
    if (blank(roles)) throw new BadRequestException("Nenhuma função encontrada.");
    return roles;
  }

  async updateRoleById(roleId: number, data: CreateOrUpdateRoleDTO) {
    this.roleNotFound(roleId);
    await this.roleRepository.updateRoleById(roleId, data);
    return "Função atualizada com sucesso!";
  }

  async inactivateRoleById(roleId: number) {
    this.roleNotFound(roleId);
    await this.roleRepository.inactivateRoleById(roleId);
    return "Função inativada com sucesso!";
  }

  private async roleNotFound(roleId: number) {
    const roleExists = await this.roleRepository.findRoleById(roleId);

    if (blank(roleExists)) throw new BadRequestException("Função não encontrada.");

    return roleExists;
  }
}
