class User {
    constructor(db) {
        // data
        this.id; // id from DB
        this.nick;
        this.guid;
        this.token;
        this.socketId;
        // support
        this.db = db;
    }

    get() {
        return {
            nick: this.nick,
            guid: this.guid
        }
    }

    getSelf() {
        return {
            nick: this.nick,
            guid: this.guid
        }
    }

    login(nick, hash, rand, socketId) {
        // убрать это говно
        return this.db.login({
            nick: this.nick,
            hash: this.hash,
            rand: this.rand,
            users
        }, socket);
    }
}