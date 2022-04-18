const md5 = require('md5');
class User {
    constructor(db) {
        // data
        this.id; // id from DB
        this.nick;
        this.hash;
        this.token;
        this.socketId;
        // support
        this.db = db;
    }

    get() {
        return {
            nick: this.nick,
            hash: this.hash
        }
    }

    getSelf() {
        return {
            nick: this.nick,
            hash: this.hash,
        }
    }

    logout(){
        this.db.disconnect(this.nick);
    }

    async login(nick, hash, rand, token, socketId) {
        this.nick = nick;
        this.token = token;
        this.socketId = socketId;
        const user = await this.db.getUserByNick(nick);
        if(user && md5(user.hash + rand) === hash) return true;
        return false;
    }
}

module.exports = User;