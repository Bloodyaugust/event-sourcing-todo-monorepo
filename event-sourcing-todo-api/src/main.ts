import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
