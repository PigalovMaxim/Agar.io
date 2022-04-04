const BaseModule = require('../BaseModule');
let md5 = require('md5');

class UserManager extends BaseModule {
    constructor(options) {
        super(options);

        this.mediator = options.mediator;

        options.io.on('connection', socket => {
            socket.on(options.SOCKET.REGISTRATION, (data, response) => this.registration(data, response, socket.id));
            socket.on(options.SOCKET.LOGIN, (data, response) => this.login(data, response, socket.id));
        }); 
    }

    registration(data, response, id){
        const { nick, hash } = data;
        this.mediator.get(this.mediator.TRIGGERS.GET_USER_BY_NICK, nick).then(user => {
            if(user){
                response({ status: false });    
            } else {
                this.mediator.call(this.mediator.EVENTS.USER_REGISTRATION, {nick, hash, id});
                response({ status: true, id }); 
            }
        });
    }

    login(data, response, id) {
        const user = this.mediator.get(this.mediator.TRIGGERS.LOGIN, data);
        if(user){
            response({ 
                status: true, 
                id
            });
            return;
        }      
        response({ status: false });
    }
}

module.exports = UserManager;