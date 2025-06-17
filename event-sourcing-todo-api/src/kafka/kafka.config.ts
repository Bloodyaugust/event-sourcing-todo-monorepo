import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [process.env.KAFKA_BROKER_ENDPOINT as string],
    },
  },
};
