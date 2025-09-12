import { PersonRepository } from "@modules/person/dao/person.repository";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CompanyType } from "@prisma/client";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { PatientRepository } from "./dao/patient.repository";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

const { blank } = new GlobalFunctions();

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async create(dto: CreatePatientDto, userToken) {
    const userId = userToken.userId; // TODO: Get User By Token
    const companyType = userToken.companyType; // TODO: Get By TOken

    const userData = await this.personRepository.findPersonById(userId, { company: true });

    if (blank(userData)) throw new NotFoundException("Usuário não encontrado!");

    let homecareId;
    let supplierId;

    if (companyType === CompanyType.HOMECARE) {
      homecareId = userData.company[0].id;
    }

    if (companyType === CompanyType.SUPPLIER) {
      supplierId = userData.company[0].id;
    }

    const person = await this.personRepository.findOrCreatePerson(dto);

    if (blank(person)) throw new NotFoundException("Pessoa não encontrada!");

    const dataPatient = {
      ...dto,
      homecareId,
      supplierId,
    };

    const patient = await this.patientRepository.createPatient(
      dataPatient,
      person.id,
      userId,
      supplierId,
      homecareId,
    );

    if (blank(patient)) throw new InternalServerErrorException("Erro ao criar paciente!");

    return "Pessoa criada com sucesso!";
  }
  async findAll() {
    return await this.patientRepository.findAll();
  }
  async findOne(id: string) {
    return await this.patientRepository.findOne(id);
  }
  async update(id: string, dto: UpdatePatientDto) {
    await this.patientRepository.update(id, dto);
    return "Paciente atualizado com sucesso!";
  }
  async remove(id: string) {
    await this.patientRepository.remove(id);
    return "Paciente inativado com sucesso!";
  }
}
