import { Module } from '@nestjs/common';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { PersonRepository } from './dao/person.repository';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
  imports: [PrismaModule],
  controllers: [PersonController],
  providers: [
    PersonService,
    StorageService,
    FileStorage,
    PersonRepository,
    PrismaService,
  ],
})
export class PersonModule {}
