import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { ZodExceptionFilter } from './zod-exception.filter';
import helmet from 'helmet';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: env.CORS_ORIGIN },
  });

  await app.listen(env.PORT);
  app.useGlobalFilters(new ZodExceptionFilter());
  app.use(helmet());
};

bootstrap();
