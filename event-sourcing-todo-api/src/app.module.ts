import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmDataSourceConfig } from './typeorm.datasource';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forRoot({
      ...typeOrmDataSourceConfig,
      autoLoadEntities: true,
    }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
