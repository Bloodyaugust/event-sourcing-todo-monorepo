import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [KafkaModule],
})
export class TodosModule {}
