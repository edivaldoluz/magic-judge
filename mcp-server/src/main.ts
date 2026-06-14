import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.enableCors();

  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await app.listen(port);

  const logger = new Logger('MagicJudge');
  logger.log(`Servidor MCP no ar — endpoint streamable: http://localhost:${port}/mcp`);
}

bootstrap();
