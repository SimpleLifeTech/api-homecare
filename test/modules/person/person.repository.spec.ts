import { PersonRepository } from "@modules/person/dao/person.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { PrismaService } from "src/database/prisma/prisma.service";

import { mockCreatePersonDTO, mockPersonModel } from "./person.mock";

describe("PersonRepository", () => {
  let repository: PersonRepository;
  let prismaService: PrismaService;
  let fileStorage: FileStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonRepository,
        {
          provide: PrismaService,
          useValue: {
            person: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: FileStorage,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PersonRepository>(PersonRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    fileStorage = module.get<FileStorage>(FileStorage);
  });

  describe("createPerson", () => {
    it("should create a person without image", async () => {
      jest.spyOn(prismaService.person, "create").mockResolvedValue(mockPersonModel);

      const result = await repository.createPerson(mockCreatePersonDTO, null);

      expect(result).toEqual(mockPersonModel);
      expect(prismaService.person.create).toHaveBeenCalledWith({
        data: { ...mockCreatePersonDTO, profileImageUrl: null, isFirstAccess: true },
      });
    });

    it("should create a person with image", async () => {
      const mockFile = { buffer: Buffer.from("test") } as Express.Multer.File;
      const mockImageUrl = "http://example.com/image.jpg";

      jest.spyOn(prismaService.person, "create").mockResolvedValue(mockPersonModel);
      jest.spyOn(fileStorage, "uploadImage").mockResolvedValue(mockImageUrl);
      jest.spyOn(prismaService.person, "update").mockResolvedValue({
        ...mockPersonModel,
        profileImageUrl: mockImageUrl,
      });

      const result = await repository.createPerson(mockCreatePersonDTO, mockFile);

      expect(result.profileImageUrl).toBe(mockImageUrl);
      expect(fileStorage.uploadImage).toHaveBeenCalled();
    });
  });

  describe("findPersonById", () => {
    it("should find a person by id", async () => {
      jest.spyOn(prismaService.person, "findUnique").mockResolvedValue(mockPersonModel);

      const result = await repository.findPersonById(mockPersonModel.id);

      expect(result).toEqual(mockPersonModel);
      expect(prismaService.person.findUnique).toHaveBeenCalledWith({
        where: { id: mockPersonModel.id, deletedAt: null },
      });
    });
  });
});
