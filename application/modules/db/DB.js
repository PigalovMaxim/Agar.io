const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');
const ORM = require('./ORM');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator){
        this.mediator = mediator;

        this.users = {};

        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.orm = new ORM(this.db);

        /* setTimeout(() => {
            this.getUserByNick('nigga');
        },1500) */
    }

    destructor() {
        if(this.db){
          this.db.close();
          this.db = null;   
        }
    }

    getUserById(id){
        return this.users[id] ? this.users[id] : null;
    }

    async getUserByNick(nick){
        const user = await this.orm.get('users', {nick});
        return user;
    }

    async registration(data = {}, socket){
        const status = await this.orm.insert('users', data);
        socket.emit(this.mediator.SOCKETS.REGISTRATION, {status});
    }

    async login(data = {}, socket){
        const { nick, hash, rand } = data;
        const user = await this.getUserByNick(nick);
        let status = false;
        if (user && hash === md5(user.hash + rand)){
            this.users[socket.id] = user;
            status = true;
        }
        socket.emit(this.mediator.SOCKETS.LOGIN, {status});
    }

}

module.exports = DB;