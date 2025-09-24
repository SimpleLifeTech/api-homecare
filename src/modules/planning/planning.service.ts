import { CompanyService } from '@modules/company/company.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { PlanningRepository } from './dao/planning.repository';
import { CreatePlanningDTO } from './dto/create-planning.dto';
import { UpdatePlanningDTO } from './dto/update-planning.dto';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { BranchService } from '@modules/branch/branch.service';
import { PatientService } from '@modules/patient/patient.service';
import { Employee, Patient } from '@prisma/client';

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class PlanningService {
  constructor(
    @Inject(PlanningRepository)
    protected readonly planningRepository: PlanningRepository,
    protected readonly branchService: BranchService,
    protected readonly companyService: CompanyService,
    protected readonly patientService: PatientService,
    protected readonly cache: CacheRepository
  ) {}

  async createPlanning(branchId: string, homecareId: string, data: CreatePlanningDTO) {
    const branch = await this.branchService.branchExists(branchId);

    if (blank(branch)) {
      throw new BadRequestException("Filial nao encontrada");
    }

    // TODO: existem funcionarios na branch?
    // const employees = await this.employeeService.findEmployeesByBranchId(branch.id);

    // if (blank(employees)) {
    //   throw new BadRequestException("Nenhum funcionário encontrado para essa filial");
    // }


    const employees = [];

    
       // TODO: existem pacientes na company?
    const patients = await this.patientService.findPatientsByHomecareId(homecareId);

    await this.generateServices(patients, employees);

    await this.planningRepository.createPlanning(data);

    return "Agenda criada com sucesso!";
  }

  async generateServices(patients: Patient[], employees: Employee[]) {
    for (const patient of patients) {
      for (const employee of employees) {
        await this.planningRepository.createService(patient.id, employee.id);
      }
    }
  }

  // async findPlanningByCompanyId(companyId: string) {
  //   await this.companyService.companyExists(companyId);
  //   const planninges = await this.planningRepository.findPlanningByCompanyId(companyId);

  //   if (blank(planninges))
  //     throw new BadRequestException("Nenhuma agenda encontrada para essa empresa");

  //   return planninges;
  // }

  // async findPlanningById(planningId: string) {
  //   return await this.planningExists(planningId);
  // }

  // async updatePlanningById(planningId: string, data: UpdatePlanningDTO) {
  //   await this.planningExists(planningId);
  //   await this.planningRepository.updatePlanningById(planningId, data);
  //   await this.cache.del(this.cacheKey(planningId));
  //   return "Agenda atualizada com sucesso!";
  // }

  // async inactivatePlanningById(planningId: string) {
  //   await this.planningExists(planningId);
  //   await this.planningRepository.inactivatePlanningById(planningId);
  //   await this.cache.del(this.cacheKey(planningId));
  //   return "Agenda inativada com sucesso!";
  // }

  // async planningExists(planningId: string) {
  //   const cachekey = this.cacheKey(planningId);
  //   const cache = await this.cache.get(cachekey);

  //   if (filled(cache)) return cache;

  //   const planning = await this.planningRepository.findPlanningById(planningId);

  //   if (blank(planning)) throw new BadRequestException("Agenda não encontrada");

  //   await this.cache.set(cachekey, planning);
  //   return planning;
  // }

  // private cacheKey(planningId: string) {
  //   return `planning:${planningId}`
  // } 
}
