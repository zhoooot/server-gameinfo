import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class ClientList {
    public clientList: {[key: string] : {username: string, data: Socket}} = {};

    toArray() {
        const arr = Object.keys(this.clientList).map(key => ({ key: key, value: this.clientList[key] }));
        return arr;
    }

    add(id: string, username: string, data: Socket) {
        this.clientList[id] = {username: username, data: data};
    }
}