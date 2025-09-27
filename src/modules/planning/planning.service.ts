import { CompanyService } from '@modules/company/company.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import { PlanningRepository } from './dao/planning.repository';
import { CreatePlanningDTO } from './dto/create-planning.dto';
import { UpdatePlanningDTO } from './dto/update-planning.dto';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { BranchService } from '@modules/branch/branch.service';
import { PatientService } from '@modules/patient/patient.service';
import { EmployeeService } from '@modules/employee/employee.service';
import { Employee, Patient, PatientRelationships, Service } from '@prisma/client';
import { ServiceRepository } from './dao/service.repository';

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class PlanningService {
  constructor(
    @Inject(PlanningRepository)
    protected readonly planningRepository: PlanningRepository,
    protected readonly branchService: BranchService,
    protected readonly companyService: CompanyService,
    protected readonly patientService: PatientService,
    protected readonly employeeService: EmployeeService,
    protected readonly serviceRepository: ServiceRepository,
    protected readonly cache: CacheRepository
  ) { }

  async createPlanning(branchId: string, userId: string, data: CreatePlanningDTO) {
    const branch = await this.branchService.branchExists(branchId);

    if (blank(branch)) {
      throw new BadRequestException("Filial nao encontrada");
    }

    const employees = await this.employeeService.findEmployeesByBranchIdAndByCareServiceType(
      branch.id,
      data.careServiceType,
    );

    if (blank(employees)) {
      throw new BadRequestException("Nenhum funcionário encontrado para essa filial");
    }

    const patientRelationships = await this.patientService.findPatientRelationshipsByCareServiceType(
      data.homecareId,
      data.careServiceType
    );

    if (blank(patientRelationships)) {
      throw new BadRequestException("Nenhum paciente encontrado para esse homecare");
    }

    await this.generateServices(patientRelationships, employees, data.month, data.year);

    await this.planningRepository.createPlanning({
      month: data.month,
      year: data.year,
      createdBy: userId,
      branchId: branch.id,
    });

    return "Agenda criada com sucesso!";
  }

    /**
     * Gera automaticamente registros de "Service" para cada paciente,
     * distribuindo funcionários de acordo com as horas de cuidado necessárias.
     */
    async generateServices(
      patientRelationships: Array<{
        id: string; // id do PatientRelationship
        patientId: string; // id do paciente
        requiredCareHours: number; // horas de cuidado necessárias por dia
        homecareId?: string | null;
        supplierId?: string | null;
        fictionalHomecareId?: string | null;
        fictionalSupplierId?: string | null;
      }>,
      employees: Array<{ id: string }>, // lista de funcionários disponíveis
      month: number, // mês da escala
      year: number // ano da escala
    ) {
      // Se não houver pacientes ou funcionários, não há o que gerar
      if (!patientRelationships.length || !employees.length) return;
  
      // Determina a data inicial e final do mês escolhido
      const monthStart = startOfMonth(new Date(year, month - 1, 1));
      const monthEnd = endOfMonth(monthStart);
  
      // Calcula o número de dias do mês
      const totalDays =
        (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
  
      // Array onde vamos acumular todos os registros de "Service" a serem criados
      const servicesToCreate: any[] = [];
  
      // Índice usado para alternar funcionários e distribuir de forma cíclica
      let employeeIndex = 0;
  
      // Loop por cada dia do mês
      for (let i = 0; i < totalDays; i++) {
        // Data atual (incrementa um dia a cada iteração)
        const currentDay = addDays(monthStart, i);
  
        // Loop por cada relacionamento (paciente) filtrado pelo tipo de serviço
        for (const patient of patientRelationships) {
          // Quantas horas de cuidado esse paciente precisa nesse dia
          const hours = patient.requiredCareHours ?? 0;
          if (hours <= 0) continue; // pula se não precisa de cuidado
  
          let remainingHours = hours; // controla o quanto falta atribuir
          let startHour = 0; // controla o horário de início do próximo turno
  
          // Enquanto houver horas a serem atribuídas, criamos blocos de serviço
          while (remainingHours > 0) {
            // Pega o próximo funcionário da lista (vai ciclando pelo %)
            const employee = employees[employeeIndex % employees.length];
            employeeIndex++;
  
            const shiftHours = 1; // definimos 1h por bloco; pode ajustar se quiser blocos maiores
  
            // Calcula o horário de início e fim para esse bloco
            const startAt = new Date(currentDay);
            startAt.setHours(startHour, 0, 0, 0);
  
            const endAt = new Date(currentDay);
            endAt.setHours(startHour + shiftHours, 0, 0, 0);
  
            // Determina o companyId para o Service (pode vir de vários campos)
            const companyId =
              patient.homecareId ??
              patient.supplierId ??
              patient.fictionalHomecareId ??
              patient.fictionalSupplierId ??
              "";
  
            // Monta o registro de Service que será gravado no banco
            servicesToCreate.push({
              id: crypto.randomUUID(),
              companyId,
              patientId: patient.patientId,
              employeeId: employee.id,
              patientRelationshipId: patient.id, // opcional se quiser vincular
              title: `Atendimento ${startHour}-${startHour + shiftHours}h`,
              description: `Atendimento automático para paciente ${rel.patientId}`,
              startAt,
              startTime: startAt.toTimeString().slice(0, 5), // HH:mm
              endAt,
              endTime: endAt.toTimeString().slice(0, 5),
              createdAt: new Date(),
              updatedAt: null,
              deletedAt: null
            });
  
            // Atualiza as variáveis para o próximo bloco
            remainingHours -= shiftHours; // diminui as horas restantes
            startHour += shiftHours; // avança o horário de início do próximo bloco
          }
        }
      }
  
      // Por fim, se houver registros, insere todos de uma vez no banco
      if (filled(servicesToCreate)) {
        await this.serviceRepository.createMany(servicesToCreate);
      }
  
      // Retorna quantos serviços foram gerados (opcional)
      return servicesToCreate;
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
