import { Module } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
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
    CacheRepository,
    PersonRepository,
    PrismaService,
  ],
  exports: [PersonRepository,PersonService],
})
export class PersonModule {}
