import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

describe('TodosController', () => {
  let controller: TodosController;
  let todosService: jest.Mocked<TodosService>;

  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Todo',
    done: false,
    createdAt: '2025-06-18T10:00:00.000Z',
    updatedAt: '2025-06-18T10:00:00.000Z',
  };

  beforeEach(async () => {
    const mockTodosService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      handleCreate: jest.fn(),
      handleUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    todosService = module.get(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', () => {
      const createTodoDto: CreateTodoDto = {
        name: 'New Todo',
      };

      todosService.create.mockReturnValue(mockTodo);

      const result = controller.create(createTodoDto);

      expect(todosService['create']).toHaveBeenCalledWith(createTodoDto);
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return all todos', () => {
      const mockTodos = [mockTodo];
      todosService.findAll.mockReturnValue(Promise.resolve(mockTodos));

      const result = controller.findAll();

      expect(todosService['findAll']).toHaveBeenCalled();
      expect(result).toEqual(Promise.resolve(mockTodos));
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      todosService.findOne.mockReturnValue(Promise.resolve(mockTodo));

      const result = controller.findOne(id);

      expect(todosService['findOne']).toHaveBeenCalledWith(id);
      expect(result).toEqual(Promise.resolve(mockTodo));
    });
  });

  describe('update', () => {
    it('should update a todo', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateTodoDto: UpdateTodoDto = {
        name: 'Updated Todo',
        done: true,
      };

      const result = controller.update(id, updateTodoDto);

      expect(todosService['update']).toHaveBeenCalledWith(id, updateTodoDto);
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      const result = controller.remove(id);

      expect(todosService['remove']).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });

  describe('handleCreateTodoEvent', () => {
    it('should handle create todo event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      todosService.handleCreate.mockResolvedValue(undefined);

      controller.handleCreateTodoEvent(mockTodo);

      expect(consoleSpy).toHaveBeenCalledWith(
        `handleCreateTodoEvent with payload: ${JSON.stringify(mockTodo)}`,
      );
      expect(todosService['handleCreate']).toHaveBeenCalledWith(mockTodo);

      consoleSpy.mockRestore();
    });
  });

  describe('handleUpdateTodoEvent', () => {
    it('should handle update todo event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      todosService.handleUpdate.mockResolvedValue(undefined);

      controller.handleUpdateTodoEvent(mockTodo);

      expect(consoleSpy).toHaveBeenCalledWith(
        `handleUpdateTodoEvent with payload: ${JSON.stringify(mockTodo)}`,
      );
      expect(todosService['handleUpdate']).toHaveBeenCalledWith(mockTodo);

      consoleSpy.mockRestore();
    });
  });
});
