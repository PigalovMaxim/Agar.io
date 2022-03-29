const BaseModule = require('../BaseModule');

class ChatManager {
    constructor(options){
        super(options);
        
        this.messages = [];
        this.users = [];

        this.io.on(options.SOCKET.MESSAGE, socket => {
            socket.on(options.SOCKET.MESSAGE, data => this.move(data, socket.id));
            
        });

    }

    showMessage(){

    }

    sendMessage(){

    }
}