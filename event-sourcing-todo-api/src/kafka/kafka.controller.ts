import { Controller, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices';
import { kafkaConfig } from './kafka.config';

@Controller('kafka')
export class KafkaController implements OnModuleInit {
  @Client(kafkaConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = ['todo-event'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @EventPattern('todo-event')
  handleTodoEvent(payload: any) {
    console.log(`handleTodoEvent with payload: ${JSON.stringify(payload)}`);
  }
}
