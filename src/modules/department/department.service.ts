import { BranchService } from '@modules/branch/branch.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { DepartmentEmployeeRepository } from './dao/department-employee.repository';
import { DepartmentRepository } from './dao/department.repository';
import { AddOrUpdateEmployeeDepartmentDTO } from './dto/add-or-update-employee-to-department.dto';
import { CreateDepartmentDTO } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';
import { CacheRepository } from '@shared/shared/cache/cache.repository';

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(DepartmentRepository) private readonly departmentRepository: DepartmentRepository,
    @Inject(DepartmentEmployeeRepository)
    private readonly departmentEmployeeRepository: DepartmentEmployeeRepository,
    private readonly branchService: BranchService,
    private readonly cache: CacheRepository
  ) {}

  async createDepartment(data: CreateDepartmentDTO) {
    await this.branchService.findBranchById(data.branchId);
    const hasDepartment = await this.departmentRepository.findDepartmentByName(
      data.name,
      data.branchId,
    );

    if (filled(hasDepartment))
      throw new BadRequestException("Departamento já cadastrado, utilize outro nome");

    if (filled(data.employees)) {
      await this.departmentRepository.createDepartmentWithEmployees(data, data.employees);
    } else {
      await this.departmentRepository.createDepartment(data);
    }

    return "Departamento criado com sucesso!";
  }

  async addSingleOrManyEmployee(data: AddOrUpdateEmployeeDepartmentDTO[]) {
    const employeeIds = data.map((item) => item.employeeId);
    const departmentId = data[0].departmentId;
    const hasEmployees = await this.departmentEmployeeRepository.findAllByEmployeeId(employeeIds, departmentId);

    if (filled(hasEmployees)) throw new BadRequestException("Funcionário ja cadastrado no departamento");

    await this.departmentEmployeeRepository.addSingleOrManyEmployee(data);
    const hasOneOrMoreEmployees = data.length > 1 ? "Funcionários adicionados" : "Funcionário adicionado";
    return `${hasOneOrMoreEmployees} ao departamento com sucesso!`;
  }

  async findDepartmentById(departmentId: string) {
    return await this.getDepartmentById(departmentId);
  }

  async findDepartmentEmployeeByDepartmentId(departmentId: string) {
      await this.getDepartmentById(departmentId);
      const departmentEmployees = await this.departmentEmployeeRepository.findByDepartmentId(departmentId);
      return departmentEmployees ? departmentEmployees : [];
  }

  async findDepartmentsByBranchId(branchId: string) {
    await this.branchService.findBranchById(branchId);
    const departments = await this.departmentRepository.findDepartmentsByBranchId(branchId);
    return departments ? departments : [];
  }

  async updateDepartmentById(departmentId: string, data: UpdateDepartmentDTO) {
    await this.getDepartmentById(departmentId);
    await this.departmentRepository.updateDepartmentById(departmentId, data);
    await this.cache.del(this.cacheKey(departmentId));
    return "Departamento atualizado com sucesso!";
  }

  async updateFeatureById(departmentEmployeeId: string, data: AddOrUpdateEmployeeDepartmentDTO) {
    await this.departmentEmployeeRepository.updateFeatureById(departmentEmployeeId, data);
    return "Função atualizada com sucesso!";
  }

  async inactivateDepartmentById(departmentId: string) {
    await this.getDepartmentById(departmentId);
    await this.departmentRepository.inactivateDepartmentById(departmentId);
    await this.cache.del(this.cacheKey(departmentId));
    return "Departamento inativado com sucesso!";
  }

  async inactivateSingleOrManyEmployee(employeeIds: string[], departmentId: string) {
    await this.getDepartmentById(departmentId);
    const hasEmployees = await this.departmentEmployeeRepository.findAllByEmployeeId(employeeIds, departmentId);
    const diffBetweenEmployeeIds = employeeIds.filter((id) => !hasEmployees.map((item) => item.id).includes(id));

    //TODO: Listar o nome dos funcionários que nao pertencem ao departamento na mensagem do erro
    if (filled(diffBetweenEmployeeIds)) throw new BadRequestException("Você listou um ou mais funcionários que não pertencem ao departamento");
    await this.departmentEmployeeRepository.inactivateSingleOrManyEmployee(employeeIds, departmentId);
    return "Funcionário inativado com sucesso!";
  }

  async getDepartmentById(departmentId: string) {
    const cachedDepartment = await this.cache.get(this.cacheKey(departmentId));

    if (filled(cachedDepartment)) return cachedDepartment;

    const department = await this.departmentRepository.findDepartmentById(departmentId);

    if (blank(department)) throw new BadRequestException("Departamento não encontrado");

    await this.cache.set(this.cacheKey(departmentId), department);
    return department;
  }

  private cacheKey(departmentId: string) {
    return `department-${departmentId}`;
  }
}
