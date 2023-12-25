import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange2',
          type: 'fanout',
        },
      ],
      uri: 'amqps://kkkk@kkkk/upkmrspf',
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
      channels: {
        'channel-1': {
          prefetchCount: 15,
          default: true,
        },
      }
    }),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
