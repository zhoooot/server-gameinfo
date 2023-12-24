export class JoinMessage {
    constructor(public readonly room: string, public readonly username: string) {}

    public static fromJSON(json: any): JoinMessage {
        return new JoinMessage(json.gamecode, json.username);
    }

    public toJSON(): any {
        return {
            gamecode: this.room,
            username: this.username,
        };
    }

    public toString(): string {
        return JSON.stringify(this.toJSON());
    }

    public getGameCode(): string {
        return this.room;
    }

    public getUsername(): string {
        return this.username;
    }
}