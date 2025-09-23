import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { initBuckets } from '@shared/shared/externals/file-storage/filte-storage-bucket-init';
import { AllExceptionsFilter } from '@shared/shared/interceptors/all-exceptions.filter';
import { ResponseInterceptor } from '@shared/shared/interceptors/response.interceptor';
import { CustomLogger } from '@shared/shared/logs/custom.logger';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import helmet from 'helmet';

import { AppModule } from './app.module';

const dotEnv = dotenv.config();
dotenvExpand.expand(dotEnv);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.APPS_URL?.split(','),
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    bufferLogs: true,
    logger: false,
  });

  const logger = app.get(CustomLogger);
  app.useLogger(logger);
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const error = {
          status: false,
          data: null,
          error: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        };
        return new BadRequestException(error);
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  const storageService = app.get(StorageService);
  await initBuckets(storageService.getClient(), configService);

  const port = process.env.PORT || 9000;
  await app.listen(port);
  logger.log(`🚀 Server is running on port ${port}`);
}
bootstrap();
