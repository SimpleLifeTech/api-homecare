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
        id: string;
        patientId: string;
        requiredCareHours: number;
        homecareId?: string | null;
        supplierId?: string | null;
        fictionalHomecareId?: string | null;
        fictionalSupplierId?: string | null;
      }>,
      employees: Array<{ id: string }>,
      month: number,
      year: number
    ) {
      // Se não há pacientes ou funcionários, não há o que fazer
      if (!patientRelationships.length || !employees.length) return;
    
      // 📅 Definimos o início e fim do mês
      const monthStart = startOfMonth(new Date(year, month - 1, 1));
      const monthEnd = endOfMonth(monthStart);
      // Calcula total de dias do mês
      const totalDays =
        (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    
      // Array final que vamos usar para inserir os registros na tabela Service
      const servicesToCreate: Service[] = [];
    
      /**
       * 🆕 Agenda de disponibilidade dos funcionários
       * Estrutura: employeeSchedule[employeeId][yyyy-mm-dd] = [horas ocupadas]
       * Assim conseguimos garantir que um mesmo funcionário não seja alocado no mesmo horário/dia para dois pacientes diferentes.
       */
      const employeeSchedule: Record<string, Record<string, number[]>> = {};
    
      // ⏰ Definimos o horário de expediente
      const WORK_START_HOUR = 7; // início às 7h
      const WORK_END_HOUR = 19;  // fim às 19h
    
      // 🔄 Loop pelos dias do mês
      for (let i = 0; i < totalDays; i++) {
        const currentDay = addDays(monthStart, i);
        // Criamos uma chave do tipo yyyy-mm-dd para facilitar comparações
        const dateKey = currentDay.toISOString().split("T")[0];
    
        // Para cada relação de paciente (patientRelationships)
        for (const patientRel of patientRelationships) {
          const hours = patientRel.requiredCareHours ?? 0;
          if (hours <= 0) continue;
    
          // Quantidade de horas que ainda precisa ser atendida nesse dia
          let remainingHours = hours;
          // Começamos do horário inicial do expediente
          let startHour = WORK_START_HOUR;
    
          // Enquanto ainda houver horas para atender esse paciente nesse dia
          // E enquanto não ultrapassar o horário de expediente
          while (remainingHours > 0 && startHour < WORK_END_HOUR) {
            // ⏳ Definimos o tamanho do bloco de atendimento (ex: 1 hora)
            const shiftHours = 1;
    
            /**
             * 🆕 Procuramos um funcionário disponível nesse dia/horário
             * - `employeeSchedule[emp.id][dateKey]` nos diz os horários já ocupados desse funcionário.
             * - Se includes(startHour) é true, significa que já está ocupado nesse horário.
             */
            const availableEmployee = employees.find((emp) => {
              const empDaySchedule =
                employeeSchedule[emp.id]?.[dateKey] ?? [];
              // verifica se esse horário já está ocupado
              return !empDaySchedule.includes(startHour);
            });
    
            // Se não encontrar funcionário livre, lança erro (ou trate de outra forma)
            if (!availableEmployee) {
              throw new Error(
                `Não há funcionários livres para ${dateKey} às ${startHour}h`
              );
            }
    
            // 🆕 Marca esse horário como ocupado para esse funcionário no mapa de disponibilidade
            if (!employeeSchedule[availableEmployee.id]) employeeSchedule[availableEmployee.id] = {};
            if (!employeeSchedule[availableEmployee.id][dateKey]) employeeSchedule[availableEmployee.id][dateKey] = [];
            employeeSchedule[availableEmployee.id][dateKey].push(startHour);
    
            // ⏲️ Monta datas/hora do Service
            const startAt = new Date(currentDay);
            startAt.setHours(startHour, 0, 0, 0);
            const endAt = new Date(currentDay);
            endAt.setHours(startHour + shiftHours, 0, 0, 0);
    
            /**
             * 📝 Determina o companyId para o serviço:
             * Pode ser homecareId, supplierId, fictionalHomecareId ou fictionalSupplierId
             */
            const companyId =
              patientRel.homecareId ??
              patientRel.supplierId ??
              patientRel.fictionalHomecareId ??
              patientRel.fictionalSupplierId ??
              "";
    
            // Adiciona no array que depois será persistido no banco
            servicesToCreate.push({
              id: crypto.randomUUID(),
              companyId,
              employeeId: availableEmployee.id,
              patientRelationshipId: patientRel.id,
              title: `Atendimento ${startHour}-${startHour + shiftHours}h`,
              description: `Atendimento automático para paciente ${patientRel.patientId}`,
              startAt,
              startTime: startAt.toTimeString().slice(0, 5),
              endAt,
              endTime: endAt.toTimeString().slice(0, 5),
              createdAt: new Date(),
              updatedAt: null,
              deletedAt: null,
            });
    
            // 🆗 Atualiza contadores
            remainingHours -= shiftHours;
            startHour += shiftHours;
          }
        }
      }
    
      // Finalmente, insere todos os serviços criados no repositório
      if (filled(servicesToCreate)) {
        await this.serviceRepository.createMany(servicesToCreate);
      }
    
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
