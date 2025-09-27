import { BranchService } from "@modules/branch/branch.service";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { PersonService } from "@modules/person/person.service";
import { Person } from "@modules/person/types/person.types";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Employee } from "@prisma/client";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { Buckets } from "@shared/shared/externals/file-storage/filte-storage.types";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { EmployeeRepository } from "./dao/employee.repository";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

const { blank, filled, removeSpecialCharacters } = new GlobalFunctions();

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(PersonRepository)
    private readonly personRepository: PersonRepository,
    private readonly personService: PersonService,
    private readonly branchService: BranchService,
    private readonly fileStorage: FileStorage,
    private readonly cache: CacheRepository,
  ) {}

  async createEmployee(
    data: CreateEmployeeDto,
    personalDocument?: Express.Multer.File,
    professionalDocument?: Express.Multer.File,
    criminalRecord?: Express.Multer.File,
    resume?: Express.Multer.File,
  ) {
    await this.branchService.branchExists(data.branchId);
    const cleanDocument = removeSpecialCharacters(data.document);
    const hasPerson = await this.personRepository.findPersonByDocument(cleanDocument);

    if (filled(hasPerson)) {
      const hasEmployee = await this.employeeRepository.findEmployeeByPersonIdAndBranchId(
        hasPerson.id,
        data.branchId,
      );
      if (filled(hasEmployee)) throw new BadRequestException("Este funcionário já está cadastrado");
    }

    const documentFiles = {
      personalDocument,
      professionalDocument,
      criminalRecord,
      resume,
    };

    const documentUrls = await this.fileStorage.uploadDocuments(
      Buckets.employee_documents,
      documentFiles,
    );

    try {
      const personData = {
        name: data.name,
        email: data.email ?? "",
        document: data.document,
        birthdate: data.birthdate,
        password: "",
        phone: data.phone,
        address: data.address,
        addressNumber: data.addressNumber,
        addressComplement: data.addressComplement,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZipcode: data.addressZipcode,
      };

      let employeeData: any = {
        branchId: data.branchId,
        workRoleId: data.workRoleId,
        workTime: data.workTime,
        dayOffTime: data.dayOffTime,
        ...documentUrls,
      };

      if (filled(hasPerson)) {
        employeeData = { ...employeeData, personId: hasPerson.id };
        await this.employeeRepository.createEmployee(employeeData);
        return "Funcionário criado com sucesso";
      }

      const person = (await this.personService.createPerson(personData)) as Person;
      employeeData = { ...employeeData, personId: person.id };

      await this.employeeRepository.createEmployee(employeeData);
      return "Funcionário criado com sucesso";
    } catch (error) {
      const hasDocuments = Object.entries(documentUrls).some(([key, value]) => filled(value));

      await this.recordsWereCreated(
        hasDocuments,
        documentUrls.personalDocumentUrl,
        documentUrls.professionalDocumentUrl,
        documentUrls.criminalRecordUrl,
        documentUrls.resumeUrl,
      );
    }
  }

  async findEmployeeById(employeeId: string) {
    return await this.employeeExists(employeeId);
  }

  async findEmployeesByBranchId(branchId: string) {
    await this.branchService.branchExists(branchId);
    return await this.employeeRepository.findEmployeesByBranchId(branchId);
  }

  async findEmployeesByBranchIdAndByCareServiceType(branchId: string, workRole: string) {
    await this.branchService.branchExists(branchId);
    return await this.employeeRepository.findEmployeesByBranchIdAndByCareServiceType(branchId, workRole);
  }

  async updateEmployee(
    employeeId: string,
    data: UpdateEmployeeDto,
    personalDocument?: Express.Multer.File,
    professionalDocument?: Express.Multer.File,
    criminalRecord?: Express.Multer.File,
    resume?: Express.Multer.File,
  ) {
    const employee = await this.employeeExists(employeeId);
    await this.branchService.branchExists(data.branchId);
    await this.personService.findPersonById(data.personId);

    let personalDocumentUrl = employee.personalDocumentUrl;
    let professionalDocumentUrl = employee.professionalDocumentUrl;
    let criminalRecordUrl = employee.criminalRecordUrl;
    let resumeUrl = employee.resumeUrl;

    if (filled(personalDocument)) {
      if (employee.personalDocumentUrl)
        await this.fileStorage.deleteFile(employee.personalDocumentUrl);

      personalDocumentUrl = await this.fileStorage.uploadFile(
        Buckets.employee_documents,
        personalDocument,
      );
    }

    if (filled(professionalDocument))
      if (employee.professionalDocumentUrl)
        await this.fileStorage.deleteFile(employee.professionalDocumentUrl);

    personalDocumentUrl = await this.fileStorage.uploadFile(
      Buckets.employee_documents,
      professionalDocument,
    );

    if (filled(criminalRecord))
      if (employee.criminalRecordUrl) await this.fileStorage.deleteFile(employee.criminalRecordUrl);

    personalDocumentUrl = await this.fileStorage.uploadFile(
      Buckets.employee_documents,
      criminalRecord,
    );

    if (filled(resume))
      if (employee.resumeUrl) await this.fileStorage.deleteFile(employee.resumeUrl);
    personalDocumentUrl = await this.fileStorage.uploadFile(Buckets.employee_documents, resume);

    //TODO: Verificar como vai funcionar a questão de atualizar os dados pessoais do funcionário, quem poderá atualizar?.

    const employeeData = {
      personId: data.personId,
      branchId: data.branchId,
      workRoleId: data.workRoleId,
      workTime: data.workTime,
      dayOffTime: data.dayOffTime,
      personalDocumentUrl,
      professionalDocumentUrl,
      criminalRecordUrl,
      resumeUrl,
    };

    await this.employeeRepository.updateEmployee(employeeId, employeeData);
    await this.cache.del(this.getCacheKey(employeeId));
    return "Funcionário atualizado com sucesso";
  }

  async inactivateEmployee(employeeId: string) {
    await this.employeeExists(employeeId);
    await this.cache.del(this.getCacheKey(employeeId));
    return "Funcionário removido com sucesso";
  }

  private async recordsWereCreated(
    created: boolean,
    personalDocumentUrl: string,
    professionalDocumentUrl: string,
    criminalRecordUrl: string,
    resumeUrl: string,
  ) {
    if (created) {
      if (filled(personalDocumentUrl)) await this.fileStorage.deleteFile(personalDocumentUrl);
      if (filled(professionalDocumentUrl))
        await this.fileStorage.deleteFile(professionalDocumentUrl);
      if (filled(criminalRecordUrl)) await this.fileStorage.deleteFile(criminalRecordUrl);
      if (filled(resumeUrl)) await this.fileStorage.deleteFile(resumeUrl);

      throw new BadRequestException("Erro ao criar funcionário");
    }
  }

  async employeeExists(employeeId: string) {
    const cacheKey = this.getCacheKey(employeeId);
    const cachedEmployee = await this.cache.get<Employee>(cacheKey);

    if (filled(cachedEmployee)) return cachedEmployee;

    const employee = await this.employeeRepository.findEmployeeById(employeeId);

    if (blank(employee)) throw new BadRequestException("Funcionário não encontrado");

    await this.cache.set(cacheKey, employee);
    return employee;
  }

  private getCacheKey(employeeId: string) {
    return `employee:${employeeId}`;
  }
}
