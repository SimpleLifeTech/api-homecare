import { PersonController } from "@modules/person/person.controller";
import { PersonService } from "@modules/person/person.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { mockCreatePersonDTO, mockPersonModel } from "./person.mock";
import { APIResponse } from "@modules/shared/utils/response";
import { PersonModel } from "@modules/models/person.model";

describe("PersonController", () => {
  let controller: PersonController;
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: {
            createPerson: jest.fn(),
            findPersonById: jest.fn(),
            updatePersonById: jest.fn(),
            inactivatePersonById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
    service = module.get<PersonService>(PersonService);
  });

  describe("createPerson", () => {
    it("should create a person", async () => {
      const mockFile = { buffer: Buffer.from("test") } as Express.Multer.File;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const serviceResponse: APIResponse<string, null> = {
        status: true,
        data: "Person created successfully",
        error: null,
        codeHttp: 201,
      };

      jest.spyOn(service, "createPerson").mockResolvedValue(serviceResponse);

      await controller.createPerson(mockFile, mockCreatePersonDTO, mockResponse);

      expect(service.createPerson).toHaveBeenCalledWith(mockCreatePersonDTO, mockFile);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: serviceResponse.status,
        data: serviceResponse.data,
        error: serviceResponse.error,
      });
    });
  });

  describe("findPersonById", () => {
    it("should find a person by id", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const serviceResponse: APIResponse<PersonModel, null> = {
        status: true,
        data: mockPersonModel,
        error: null,
        codeHttp: 200,
      };

      jest.spyOn(service, "findPersonById").mockResolvedValue(serviceResponse);

      await controller.listPerson(mockPersonModel.id, mockResponse);

      expect(service.findPersonById).toHaveBeenCalledWith(mockPersonModel.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: serviceResponse.status,
        data: serviceResponse.data,
        error: serviceResponse.error,
      });
    });
  });
});
