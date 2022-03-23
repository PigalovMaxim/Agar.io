const BaseModule = require('../BaseModule');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);
        this.users = [];
        this.io('connection', socket => {
            socket.on('login', data => this.login(data, socket));
            socket.on('disconnect', () => this.logout(socket));
        });

        this.mediator.set(this.TRIGGERS.GET_USER, id => this._getUser(id));
        this.mediator.set(this.TRIGGERS.GET_USERS, () => this._getUsers());
    }

    _getUser(id) {
        return this.users.find(user => user.id === id);
    }

    _getUsers() {
        return this.users;
    }

    login(data = {}, socket) {
        const { nick } = data;
        if (nick) {
            const user = {
                nick,
                id: socket.id
            }
            this.users.push(user);
            mediator.call(mediator.EVENTS.USER_LOGIN, user);
            socket.emit('login', user);
        }
    }

    logout(socket) {
        //mediator.call(mediator.EVENTS.USER_LOGOUT, user);
        //...
    }
}

module.exports = UserManager;