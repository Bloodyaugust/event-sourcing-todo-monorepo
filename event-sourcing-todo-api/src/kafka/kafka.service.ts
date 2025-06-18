import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { kafkaConfig } from './kafka.config';
import { randomUUID } from 'crypto';

interface Emittable {
  id: string;
  [key: string]: any;
}

@Injectable()
export class KafkaService implements OnModuleInit {
  @Client(kafkaConfig)
  client: ClientKafka;

  async onModuleInit() {
    const requestPatterns = ['todo-event'];

    await this.client.connect();

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  emit(topic: string, value: Emittable) {
    this.client.emit(topic, {
      key: value.id,
      value,
      headers: {
        traceId: randomUUID(),
      },
    });
  }
}
