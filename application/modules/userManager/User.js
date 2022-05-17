class User {
    constructor(db, common) {
        // data from DB
        this.id; // id from DB
        this.guid;
        this.nick;
        this.token;
        // other data
        this.socketId;
        // support
        this.db = db;
        this.common = common;
    }

    get() {
        return {
            nick: this.nick,
        }
    }

    getSelf() {
        return {
            guid: this.guid,
            nick: this.nick,
        }
    }

    _init({ id, guid, nick }, token, socketId) {
        this.id = id;
        this.guid = guid;
        this.nick = nick;
        this.token = token;
        this.socketId = socketId;
    }

    logout() {
        this.db.setToken(this.id, null);
    }

    async login(nick, password, rand, socketId) {
        const user = await this.db.getUserByNick(nick);
        if (user && this.common.getMD5(user.password + rand) === password) {
            const token = this.common.genHash(nick + password);
            await this.db.setToken(user.id, token);
            this._init(user, token, socketId);
            return true;
        }
        return false;
    }

    async registration(nick, password, socketId) {
        let user = await this.db.getUserByNick(nick);
        if (!user) {
            const guid = this.common.guid();
            await this.db.registration(nick, password, guid);
            user = await this.db.getUserByNick(nick);
            if (user) {
                if (await this.login(nick, password, guid, this.common.random(), socketId)) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = User;

