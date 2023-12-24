import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { clientData } from './client.data';
import { ClientList } from './client.list';

@Injectable()
export class ClientService {
    constructor(
        private readonly clientList: ClientList
    ) {}

    saveClient(id: string, client: Socket) {
        this.clientList[id] = new clientData('', client);
    }

    saveClientWithUsername(id: string, username: string, client: Socket) {
        this.clientList[id] = new clientData(username, client);
    }

    deleteClient(id: string) {
        delete this.clientList[id];
    }

    getClient(id: string) {
        return this.clientList[id];
    }

    getClientList() {
        return this.clientList;
    }

    getClientListInRoom(room: string) {
        return this.clientList.toArray().forEach(client => client.value.data.rooms.has(room));
    }

    getClientListInRoomExcept(room: string, id: string) {
        return this.clientList.toArray().forEach(client => client.value.data.rooms.has(room) && client.key !== id);
    }

    broadcastToRoom(room: string, event: string, data: any) {
        this.clientList.toArray().forEach(client => client.value.data.rooms.has(room) && client.value.data.emit(event, data));
    }

    gotoRoom(id: string, room: string) {
        this.clientList[id].data.join(room);
    }

    leaveRoom(id: string, room: string) {
        this.clientList[id].data.leave(room);
    }

    setClientUsername(id: string, username: string) {
        this.clientList[id].username = username;
    }

    getClientUsername(id: string) {
        return this.clientList[id].username;
    }

    getClientUsernameList() {
        return this.clientList.toArray().forEach(client => client.value.username);
    }

    getClientUsernameListInRoom(room: string) {
        return this.clientList.toArray().forEach(client => client.value.data.rooms.has(room));
    }

    getClientUsernameListInRoomExcept(room: string, id: string) {
        return this.clientList.toArray().forEach(client => client.value.data.rooms.has(room) && client.key !== id);
    }
}
