import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3000);

    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    // If we have access to the app instance, we could notify the service about the error
    // This is a simplified approach - in production you might want more sophisticated error handling
    process.exit(1);
  }
}

void bootstrap();
