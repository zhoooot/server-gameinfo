import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { clientData } from './client.data';
import { ClientList } from './client.list';

@Injectable()
export class ClientService {
  constructor(private readonly store: ClientList) {}

  logger = new Logger('ClientService');

  sendMessage(id: string, event: string, data: any) {
    console.log('Sending message to client', id, event, data);
    if (this.store.clientList[id] === undefined) {
      this.logger.log(`Client ${id} is not in the client list`);
      return;
    }
    this.store.clientList[id].data.emit(event, data);
  }

  saveClient(id: string, client: Socket) {
    this.store.clientList[id] = { username: '', data: client };
    //this.store[id] = new clientData('', client);
    //this.clientList[id] = {username: '', data: client};
    this.logger.log(
      `Client ${id} is in room ${
        this.store.clientList[id].data.rooms.values().next().value
      }`,
    );
  }

  saveClientWithUsername(id: string, username: string, client: Socket) {
    this.store.clientList[id] = new clientData(username, client);
  }

  deleteClient(id: string) {
    delete this.store[id];
  }

  getClient(id: string) {
    return this.store[id];
  }

  getClientList() {
    return this.store;
  }

<<<<<<< HEAD
  getClientListInRoom(room: string) {
    return this.store
      .toArray()
      .forEach((client) => client.value.data.rooms.has(room));
  }

  getClientListInRoomExcept(room: string, id: string) {
    return this.store
      .toArray()
      .forEach(
        (client) => client.value.data.rooms.has(room) && client.key !== id,
      );
  }

  broadcastToRoom(room: string, event: string, data: any) {
    this.store.toArray().forEach((client) => {
      if (client.value.data.rooms.has(room)) {
        client.value.data.emit(event, data);
      }
    });
    console.log('broadcastToRoom', room, event, data);
  }

  gotoRoom(id: string, room: string) {
    this.store.clientList[id].data.join(room);
  }

  leaveRoom(id: string, room: string) {
    this.store.clientList[id].data.leave(room);
  }

  setClientUsername(id: string, username: string) {
    this.store.clientList[id].username = username;
  }

  getClientUsername(id: string) {
    return this.store.clientList[id].username;
  }

  getClientUsernameList() {
    return this.store.toArray().forEach((client) => client.value.username);
  }

  getClientUsernameListInRoom(room: string) {
    return this.store
      .toArray()
      .forEach((client) => client.value.data.rooms.has(room));
  }

  getClientUsernameListInRoomExcept(room: string, id: string) {
    return this.store
      .toArray()
      .forEach(
        (client) => client.value.data.rooms.has(room) && client.key !== id,
      );
  }
=======
    getClientListInRoom(room: string) : ClientList {
        let clientListInRoom : ClientList = new ClientList();
        this.store.toArray().forEach(client => {
            if (client.value.data.rooms.has(room)) {
                clientListInRoom[client.key] = client.value;
            }
        });
        return clientListInRoom;
    }

    getClientListInRoomExcept(room: string, id: string) : string[] {
        let clientListInRoom = [];
        this.store.toArray().forEach(client => {
            if (client.value.data.rooms.has(room) && client.key !== id) {
                clientListInRoom.push(client.key);
            }
        });
        return clientListInRoom;
    }

    broadcastToRoom(room: string, event: string, data: any) : void {
        this.store.toArray().forEach(client => {
            if (client.value.data.rooms.has(room)) {
                client.value.data.emit(event, data)
            }
        });
        console.log("broadcastToRoom", room, event, data)
    }

    gotoRoom(id: string, room: string) : void {
        this.store.clientList[id].data.join(room);
    }

    leaveRoom(id: string, room: string) : void {
        this.store.clientList[id].data.leave(room);
    }

    setClientUsername(id: string, username: string) : void {
        this.store.clientList[id].username = username;
    }

    getClientUsername(id: string) : string {
        return this.store.clientList[id].username;
    }

    getClientUsernameList() : string[] {
        let clientUsernameList = [];
        this.store.toArray().forEach(client => clientUsernameList.push(client.value.username));
        return clientUsernameList;
    }

    getClientUsernameListInRoom(room: string) : string[] {
        let clientUsernameListInRoom = [];
        this.store.toArray().forEach(client => client.value.data.rooms.has(room) && clientUsernameListInRoom.push(client.value.username));
        return clientUsernameListInRoom;
    }

    getClientUsernameListInRoomExcept(room: string, id: string) : string[] {
        let clientUsernameListInRoom = [];
        this.store.toArray().forEach(client => client.value.data.rooms.has(room) && client.key !== id && clientUsernameListInRoom.push(client.value.username));
        return clientUsernameListInRoom;
    }
>>>>>>> e436c00 (Safe place)

  getRoom(id: string) {
    return this.store.clientList[id].data.rooms.values().next().value;
  }
}
