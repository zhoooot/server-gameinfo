import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientList } from './client.list';

@Module({
  imports: [Object],
  providers: [ClientService, ClientList],
  exports: [ClientService],
})
export class ClientModule {}
