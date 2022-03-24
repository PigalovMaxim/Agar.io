const BaseModule = require('../BaseModule');
let md5 = require('md5');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);
        this.users = [];
        /* options.io('connection', socket => {
            socket.on('login', data => this.login(data, socket));
            socket.on('disconnect', () => this.logout(socket));
        }); */

        this.mediator.set(this.TRIGGERS.GET_USER, id => this._getUser(id));
        this.mediator.set(this.TRIGGERS.GET_USERS, () => this._getUsers());
    }

    _getUser(nick) {
        return this.users.find(user => user.nick === nick);
    }

    _getUsers() {
        return this.users;
    }

    registration(data, socket){
        const { nick, hash } = data;
        if(this._getUser(nick)){
            return 'Такой никнейм занят';
        } else {
            const user = {
                id: socket.id,
                nick,
                hash,
            }
            this.users.push(user);
            mediator.call(this.mediator.EVENTS.USER_REGISTRATION,user);
            socket.emit('registration', user);
        }
        return true;
    }

    login(data, socket) {
        const { nick, hash, rand } = data;
        if(hash == md5(md5(this._getUser(nick).hash + rand)+rand)){
            return true;
        }
        mediator.call(mediator.EVENTS.USER_LOGIN, user);
        socket.emit('login', user);
    }

    logout() {
        mediator.call(mediator.EVENTS.USER_LOGOUT, user);
        socket.emit('logout', user);
        return true;
    }
}

module.exports = UserManager;