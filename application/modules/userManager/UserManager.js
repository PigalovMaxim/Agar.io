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
    }


    disconnect(socketId) {
        let user = Object.values(this.users).find(user => user.socketId === socketId);
        if (!user) return;
        user.logout();
        delete this.users[user.token];
    }


    getUserByToken(token) {
        const keys = Object.keys(this.users);
        for (let i = 0; i < keys.length; i++) {
            if (this.users[keys[i]].token === token)
                return this.users[keys[i]];
        }
    }

    async registration(data, socket) {
        let status = false;
        const user = new User(this.db);
        if(await user.registration({ ...data, socketId: socket.id})){
            status = true;
            user.id = Object.keys(this.users).length;
            this.users[user.token] = user;
            socket.emit(this.SOCKETS.REGISTRATION,{ status, token: user.token });
            return;
        }
        socket.emit(this.SOCKETS.REGISTRATION,{ status, token: null });
    }

    async login(data = {}, socket) {
        // 1. проверить полноту прилетевших данных
        const { nick, hash, rand } = data;
        let status = false;
        let token = '';
        if (nick && hash && rand-0) {
            // 2. создать юзверя
            const user = new User(this.db);
            token  = await this.db._generateToken({ nick, hash });
            // 3. попытаццо авторизоваться юзверя
            if (await user.login(nick, hash, rand, token, socket.id)) {
                user.id = Object.keys(this.users).length;
                this.users[user.token] = user; // 4. если ок, то добавить в юзверей
                // 5. ответить клиенту
                status = true;
                socket.emit(this.SOCKETS.LOGIN, {status, token});
                user.getSelf();
            }
        }
        socket.emit(this.SOCKETS.LOGIN, {status, token});
    }
}

module.exports = UserManager;