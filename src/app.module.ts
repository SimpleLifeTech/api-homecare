import { AuthModule } from '@modules/auth/auth.module';
import { BranchModule } from '@modules/branch/branch.module';
import { CompanyModule } from '@modules/company/company.module';
import { DepartmentModule } from '@modules/department/department.module';
import { PersonModule } from '@modules/person/person.module';
import { RoleModule } from '@modules/role/role.module';
import { RolePermissionModule } from '@modules/role_permission/role-permission.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { PrismaService } from './database/prisma/prisma.service';
import { CustomLogger } from '@shared/shared/logs/custom.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
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
    }),
    AuthModule,
    BranchModule,
    CompanyModule,
    DepartmentModule,
    PersonModule,
    RoleModule,
    RolePermissionModule,
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [CustomLogger, PrismaService],
  exports: [CustomLogger],
})
export class AppModule {}
