import { AuthModule } from '@modules/auth/auth.module';
import { BranchModule } from '@modules/branch/branch.module';
import { CompanyModule } from '@modules/company/company.module';
import { DepartmentModule } from '@modules/department/department.module';
import { PersonModule } from '@modules/person/person.module';
import { RoleModule } from '@modules/role/role.module';
import { RolePermissionModule } from '@modules/role_permission/role-permission.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@shared/shared/utils/errors/http-exeception.filter';

import { AppController } from './app.controller';
import { PrismaService } from './database/prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: (await import('cache-manager-ioredis-store')).default,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        auth_pass: config.get<string>('REDIS_PASSWORD'),
        db: config.get<number>('REDIS_DB') ?? 0,
        ttl: 60,
      }),
      isGlobal: true,
    }),
    AuthModule,
    BranchModule,
    CompanyModule,
    DepartmentModule,
    PersonModule,
    RoleModule,
    RolePermissionModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
