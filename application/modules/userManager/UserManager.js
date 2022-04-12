const BaseModule = require('../BaseModule');
const User = require('./User');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);

        this.users = {};
        this.io.on(this.SOCKETS.CONNECTION, socket => {
            socket.on(this.SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            //socket.on(this.SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(this.SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(this.SOCKETS.DISCONNECT, () => this.disconnect(socket.id));
        });

        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token => this.getUserByToken(token));
        this.mediator.set(this.mediator.TRIGGERS.DISCONNECT, id => this.disconnect(id));
    }


    disconnect(socketId) {
        if (!this.users[socketId]) return;
        const nick = this.users[socketId].nick;
        delete this.users[socketId];
        this.db.disconnect(nick);
    }


    getUserByToken(token) {
        const keys = Object.keys(this.users);
        for (let i = 0; i < keys.length; i++) {
            if (this.users[keys[i]].token === token)
                return this.users[keys[i]];
        }
    }

    getUserById(id) {
        return this.users[id] ? this.users[id] : null;
    }

    registration(data, socket) {
        this.db.registration(data, socket);
    }

    async login(data = {}, socket) {
        // 1. проверить полноту прилетевших данных
        const { nick, hash, rand } = data;
        if (nick && hash && rand-0) {
            // 2. создать юзверя
            const user = new User(this.db);
            // 3. попытаццо авторизоваться юзверя
            if (await user.login(nick, hash, rand, socket.id)) {
                this.users[user.guid] = user; // 4. если ок, то добавить в юзверей
                // 5. ответить клиенту
                // user.getSelf()
            }
        }
    }

    /* login(data, socket) {
        data['users'] = this.users;
        console.log(data);
        this.db.login(data, socket);
    } */


}

module.exports = UserManager;