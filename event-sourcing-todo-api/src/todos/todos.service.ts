import { HttpCode, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { Todo } from './entities/todo.entity';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    private readonly kafkaService: KafkaService,
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    const createdAt: string = new Date().toISOString();
    const newTodo: Todo = {
      ...createTodoDto,
      id: randomUUID(),
      createdAt,
      updatedAt: createdAt,
      done: false,
    };

    this.kafkaService.emit('create-todo-event', newTodo);

    return newTodo;
  }

  findAll() {
    return this.todosRepository.find();
  }

  findOne(id: string) {
    return this.todosRepository.findOneBy({ id });
  }

  @HttpCode(204)
  update(id: string, updateTodoDto: UpdateTodoDto) {
    const updatedAt: string = new Date().toISOString();

    this.kafkaService.emit('update-todo-event', {
      ...updateTodoDto,
      updatedAt: updatedAt,
      id,
    });
  }

  remove(id: string) {
    const updatedAt: string = new Date().toISOString();

    this.kafkaService.emit('remove-todo-event', {
      updatedAt: updatedAt,
      id,
    });
  }

  async handleCreate(newTodo: Todo) {
    await this.todosRepository.save(newTodo);
  }

  async handleUpdate(updatingTodo: Todo) {
    await this.todosRepository.save(updatingTodo);
  }
}
