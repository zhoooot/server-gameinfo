import { Socket } from "socket.io";

export class clientData {
    public username: string;
    public data: Socket;

    constructor(username: string, data: Socket) {
        this.username = username;
        this.data = data;
    }

    public getUsername(): string {
        return this.username;
    }

    public getData(): Socket {
        return this.data;
    }

    public setUsername(username: string) {
        this.username = username;
    }

    public setData(data: Socket) {
        this.data = data;
    }
}
