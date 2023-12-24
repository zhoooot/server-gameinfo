import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class ClientList {
    public clientList: {[key: string] : {username: string, data: Socket}} = {};

    toArray() {
        let result = []
        for (const key in this.clientList) {
            result.push({key: key, value: this.clientList[key]});
        }
        return result;
    }
}