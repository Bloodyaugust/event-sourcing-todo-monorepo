import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  @EventPattern('todo-event')
  handleTodoEvent(payload: any) {
    console.log(`handleTodoEvent with payload: ${JSON.stringify(payload)}`);
  }
}
