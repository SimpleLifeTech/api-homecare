import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { errorLogger, requestLogger } from "@shared/shared/utils/log/logger.http";
import * as dotenv from "dotenv";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { ResponseInterceptor } from "@shared/shared/interceptors/response.interceptor";
import { AllExceptionsFilter } from "@shared/shared/interceptors/all-exceptions.filter";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: ["error", "warn", "debug", "log", "verbose"],
  });

  app.use(helmet());
  app.use(requestLogger);
  app.use(errorLogger);

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

  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log("🚀 Server is running on port", port);
}
bootstrap();
