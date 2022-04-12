const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');
const ORM = require('./ORM');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator){
        this.mediator = mediator;

        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.orm = new ORM(this.db);
    }

    disconnect(nick){
        this.orm.update('users', {nick}, {token: ''});
    }

    destructor() {
        if(this.db){
          this.db.close();
          this.db = null;   
        }
    }

    async getUserByNick(nick){
        const user = await this.orm.get('users', {nick});
        return user;
    }

    async registration(data = {}, socket){
        const token = await this._generateToken(data);
        const status = await this.orm.insert('users', data);
        socket.emit(this.mediator.SOCKETS.REGISTRATION, {status, token});
    }

    async _generateToken(data){
        const { nick, hash } = data;
        let token = md5(hash);
        const status  = await this.orm.update('users', {nick}, {token});
        if(!status) return null;
        return token;
    }

    async login(data = {}, socket){
        const { nick, hash, rand, users } = data;
        const user = await this.getUserByNick(nick);
        let token = null;
        let status = false;
        if (user && hash === md5(user.hash + rand)){
            token = await this._generateToken(data);
            user.token = token;
            users[socket.id] = user;
            status = true;
        }
        socket.emit(this.mediator.SOCKETS.LOGIN, {status, token});
        return status;
    }

}

module.exports = DB;