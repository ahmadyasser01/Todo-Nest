import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
