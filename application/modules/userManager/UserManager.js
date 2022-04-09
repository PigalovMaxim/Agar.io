const BaseModule = require('../BaseModule');
let md5 = require('md5');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);

        

        this.io.on('connection', socket => {
            socket.on(this.SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            socket.on(this.SOCKETS.LOGIN, (data) => this.login(data, socket));
        }); 
    }
    
   
    registration(data, socket){
        this.db.registration(data, socket);
    }

    login(data, socket) {
        this.db.login(data, socket);
    }
}

module.exports = UserManager;