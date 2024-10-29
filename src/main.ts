import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { errorLogger, requestLogger } from "@shared/shared/utils/log/logger.http";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: ["error", "warn", "debug", "log", "verbose"],
  });

  app.use(requestLogger);
  app.use(errorLogger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const error = {
          status: true,
          data: null,
          error: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        };
        return new BadRequestException(error);
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log("🚀 Server is running on port", port);
}
bootstrap();
