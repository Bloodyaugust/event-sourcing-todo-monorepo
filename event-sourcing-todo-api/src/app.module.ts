import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [KafkaModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
