import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange2',
          type: 'fanout',
        },
        {
          name: 'game-created',
          type: 'fanout',
        },
      ],
      uri: 'amqp://guest:guest@0.0.0.0',
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
      channels: {
        'channel-1': {
          prefetchCount: 15,
          default: true,
        },
      },
    }),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService, RabbitMQModule],
})
export class RabbitmqModule {}
