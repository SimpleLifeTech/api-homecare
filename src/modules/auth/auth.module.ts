import { CompanyRepository } from '@modules/company/dao/company.repository';
import { PersonRepository } from '@modules/person/dao/person.repository';
import { PersonPermissionRepository } from '@modules/person_permission/dao/person-permission.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './dao/auth.repository';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    StorageService,
    FileStorage,
    PersonRepository,
    PersonPermissionRepository,
    CompanyRepository,
    AuthRepository,
    PrismaService,
  ],
})
export class AuthModule {}
