import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_URL } from 'src/config';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'game',
          type: 'fanout',
        },
      ],
      uri: RABBITMQ_URL,
    }),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService, RabbitMQModule],
})
export class RabbitmqModule {}
