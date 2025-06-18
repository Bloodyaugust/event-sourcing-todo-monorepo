import { DataSource, DataSourceOptions } from 'typeorm';
import { Todo } from './todos/entities/todo.entity';
import { AddTodo1750213782285 } from './migrations/1750213782285-AddTodo';

export const typeOrmDataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.POSTGRES_PORT as string, 10),
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
};
export const typeOrmDataSource = new DataSource({
  ...typeOrmDataSourceConfig,
  entities: [Todo],
  migrations: [AddTodo1750213782285],
});
