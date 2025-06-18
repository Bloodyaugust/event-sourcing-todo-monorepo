import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [KafkaModule, TypeOrmModule.forFeature([Todo])],
})
export class TodosModule {}
