import { PersonRepository } from "@modules/person/dao/person.repository";
import { PersonService } from "@modules/person/person.service";
import { Test, TestingModule } from "@nestjs/testing";
import { mockCreatePersonDTO, mockPersonModel, mockUpdatePersonDTO } from "./person.mock";
import { APIResponse } from "@modules/shared/utils/response";
import { PersonModel } from "@modules/models/person.model";
import { BadRequestException } from "@nestjs/common";

describe("PersonService", () => {
  let service: PersonService;
  let repository: PersonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PersonRepository,
          useValue: {
            createPerson: jest.fn(),
            findPersonById: jest.fn(),
            findPersonByDocument: jest.fn(),
            findPersonByEmail: jest.fn(),
            updatePersonById: jest.fn(),
            inactivatePersonById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repository = module.get<PersonRepository>(PersonRepository);
  });

  describe("createPerson", () => {
    it("should create a person successfully", async () => {
      const mockFile = { buffer: Buffer.from("test") } as Express.Multer.File;

      jest.spyOn(repository, "findPersonByDocument").mockResolvedValue(null);
      jest.spyOn(repository, "findPersonByEmail").mockResolvedValue(null);
      jest.spyOn(repository, "createPerson").mockResolvedValue(mockPersonModel);

      const result = await service.createPerson(mockCreatePersonDTO, mockFile);

      const expectedResponse: APIResponse<string, null> = {
        status: true,
        data: "Pessoa criada com sucesso!",
        error: null,
        codeHttp: 201,
      };

      expect(result).toEqual(expectedResponse);
    });

    it("should throw BadRequestException if document already exists", async () => {
      jest.spyOn(repository, "findPersonByDocument").mockResolvedValue(mockPersonModel);

      await expect(service.createPerson(mockCreatePersonDTO, null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("updatePersonById", () => {
    it("should update a person successfully", async () => {
      const updatedPerson = { ...mockPersonModel, ...mockUpdatePersonDTO };

      jest.spyOn(repository, "findPersonById").mockResolvedValue(mockPersonModel);
      jest.spyOn(repository, "updatePersonById").mockResolvedValue(updatedPerson);

      const result = await service.updatePersonById(mockPersonModel.id, mockUpdatePersonDTO, null);

      const expectedResponse: APIResponse<string, null> = {
        status: true,
        data: "Pessoa atualizada com sucesso!",
        error: null,
        codeHttp: 200,
      };

      expect(result).toEqual(expectedResponse);
    });
  });
});
