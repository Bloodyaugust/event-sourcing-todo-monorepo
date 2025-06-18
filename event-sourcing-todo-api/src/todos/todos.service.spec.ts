import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { KafkaService } from '../kafka/kafka.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosService', () => {
  let service: TodosService;
  let kafkaService: jest.Mocked<KafkaService>;
  let todoRepository: jest.Mocked<Repository<Todo>>;

  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Todo',
    done: false,
    createdAt: '2025-06-18T10:00:00.000Z',
    updatedAt: '2025-06-18T10:00:00.000Z',
  };

  beforeEach(async () => {
    const mockKafkaService = {
      emit: jest.fn(),
    };

    const mockTodoRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    kafkaService = module.get(KafkaService);
    todoRepository = module.get(getRepositoryToken(Todo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo and emit kafka event', () => {
      const createTodoDto: CreateTodoDto = {
        name: 'New Todo',
      };

      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2025-06-18T10:00:00.000Z');

      const result = service.create(createTodoDto);

      expect(result).toEqual({
        id: expect.any(String) as string,
        name: 'New Todo',
        done: false,
        createdAt: '2025-06-18T10:00:00.000Z',
        updatedAt: '2025-06-18T10:00:00.000Z',
      });
      expect(result.id).toBeTruthy();

      expect(kafkaService['emit']).toHaveBeenCalledWith('create-todo-event', {
        id: result.id,
        name: 'New Todo',
        done: false,
        createdAt: '2025-06-18T10:00:00.000Z',
        updatedAt: '2025-06-18T10:00:00.000Z',
      });
    });
  });

  describe('findAll', () => {
    it('should return all todos from repository', async () => {
      const mockTodos = [mockTodo];
      todoRepository.find.mockResolvedValue(mockTodos);

      const result = await service.findAll();

      expect(todoRepository['find']).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id from repository', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      todoRepository.findOneBy.mockResolvedValue(mockTodo);

      const result = await service.findOne(id);

      expect(todoRepository['findOneBy']).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockTodo);
    });

    it('should return null when todo not found', async () => {
      const id = 'non-existent-id';
      todoRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(todoRepository['findOneBy']).toHaveBeenCalledWith({ id });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should emit update event with correct data', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateTodoDto: UpdateTodoDto = {
        name: 'Updated Todo',
        done: true,
      };

      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2025-06-18T11:00:00.000Z');

      service.update(id, updateTodoDto);

      expect(kafkaService['emit']).toHaveBeenCalledWith('update-todo-event', {
        id,
        name: 'Updated Todo',
        done: true,
        updatedAt: '2025-06-18T11:00:00.000Z',
      });
    });
  });

  describe('remove', () => {
    it('should emit remove event with correct data', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue('2025-06-18T11:00:00.000Z');

      service.remove(id);

      expect(kafkaService['emit']).toHaveBeenCalledWith('remove-todo-event', {
        id,
        updatedAt: '2025-06-18T11:00:00.000Z',
      });
    });
  });

  describe('handleCreate', () => {
    it('should save new todo to repository', async () => {
      todoRepository.save.mockResolvedValue(mockTodo);

      await service.handleCreate(mockTodo);

      expect(todoRepository['save']).toHaveBeenCalledWith(mockTodo);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      todoRepository.save.mockRejectedValue(error);

      await expect(service.handleCreate(mockTodo)).rejects.toThrow(
        'Database error',
      );
      expect(todoRepository['save']).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe('handleUpdate', () => {
    it('should save updated todo to repository', async () => {
      const updatedTodo = { ...mockTodo, name: 'Updated Todo', done: true };
      todoRepository.save.mockResolvedValue(updatedTodo);

      await service.handleUpdate(updatedTodo);

      expect(todoRepository['save']).toHaveBeenCalledWith(updatedTodo);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      todoRepository.save.mockRejectedValue(error);

      await expect(service.handleUpdate(mockTodo)).rejects.toThrow(
        'Database error',
      );
      expect(todoRepository['save']).toHaveBeenCalledWith(mockTodo);
    });
  });
});
