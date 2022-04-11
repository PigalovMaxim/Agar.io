const BaseModule = require('../BaseModule');
let md5 = require('md5');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);

        this.users = {};
        this.io.on(this.SOCKETS.CONNECTION, socket => {
            socket.on(this.SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            socket.on(this.SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(this.SOCKETS.DISCONNECT, () => this.disconnect(socket.id));
        });

        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_TOKEN, token => this.getUserByToken(token));
    }


    disconnect(socketId){
        if(!this.users[socketId]) return;
        const nick = this.users[socketId].nick;
        delete this.users[socketId];
        this.db.disconnect(nick);
    }

   
    getUserByToken(token){
        const keys = Object.keys(this.users);
        for(let i = 0; i < keys.length; i++){
            if(this.users[keys[i]].token === token) 
                return this.users[keys[i]]; 
        } 
    }

    getUserById(id){
        return this.users[id] ? this.users[id] : null;
    }

    registration(data, socket){
        this.db.registration(data, socket);
    }

    login(data, socket) {
        data['users'] = this.users;
        this.db.login(data, socket);
    }
}

module.exports = UserManager;