const BaseModule = require('../BaseModule');
let md5 = require('md5');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);
        this.mediator = options.mediator;
        this.users = [];

        options.io.on('connection', socket => {
            
            socket.on(options.SOCKET.REGISTRATION, (data, response) => this.registration(data, response, socket));
            socket.on(options.SOCKET.LOGIN, (data, response) => this.login(data, response, socket));
        }); 

        this.mediator.set(this.TRIGGERS.GET_USER, id => this._getUserById(id));
        this.mediator.set(this.TRIGGERS.GET_USERS, () => this._getUsers());
    }

    _getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    _getUserByName(nick) {
        return this.users.find(user => user.nick === nick);
    }

    _getUsers() {
        return this.users;
    }

    registration(data, response, socket){
        const { nick, hash } = data;
        console.log('registration'+data);
        if(this._getUserByName(nick)){
            response({ status: false });
        } else {
            const user = {
                id: socket.id,
                nick,
                hash,
            }
            this.users.push(user);
            this.mediator.call(this.mediator.EVENTS.USER_REGISTRATION,user);
            response({ status: true, id: socket.id });
        }
    }

    login(data, response, socket) {
        const { nick, hash, rand } = data;
        if(this._getUserByName(nick) && hash == md5(this._getUserByName(nick).hash + rand)){
            response({ 
                status: true, 
                id: socket.id
            });
            //this.mediator.call(this.mediator.EVENTS.USER_LOGIN, user);
            return;
        }      
        response({ status: false });;
    }
}

module.exports = UserManager;