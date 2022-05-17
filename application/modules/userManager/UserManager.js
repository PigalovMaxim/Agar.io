const BaseModule = require('../BaseModule');
const User = require('./User');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);

        this.users = {};
        this.io.on(this.SOCKETS.CONNECTION, socket => {
            socket.on(this.SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            socket.on(this.SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(this.SOCKETS.DISCONNECT, () => this.disconnect(socket.id));
        });

        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_GUID, guid => this.getUserByGuid(guid));
    }


    async disconnect(socketId) {
        let user = Object.values(this.users).find(user => user.socketId === socketId);
        if (!user) return;
        await user.logout();
        delete this.users[user.guid];
    }

    getUserByGuid(guid) {
        const keys = Object.keys(this.users);
        for (let i = 0; i < keys.length; i++) {
            if (this.users[keys[i]].guid === guid)
                return this.users[keys[i]];
        }
    }

    async registration(data = {}, socket) {
        const { nick, password } = data;
        if (nick && password) {
            const user = new User(this.db, this.common);
            if (await user.registration(nick, password, socket.id)) {
                this.users[user.guid] = user;
                console.log(user.getSelf());
                return socket.emit(this.SOCKETS.REGISTRATION, user.getSelf());
            }
        }
        socket.emit(this.SOCKETS.REGISTRATION, false);
    }

    async login(data = {}, socket) {
        const { nick, password, rand } = data;
        if (nick && password && rand - 0) {
            const user = new User(this.db, this.common);
            if (await user.login(nick, password, rand, socket.id)) {
                this.users[user.guid] = user;
                return socket.emit(this.SOCKETS.LOGIN, user.getSelf());
            }
        }
        socket.emit(this.SOCKETS.LOGIN, false);
    }
}

module.exports = UserManager;