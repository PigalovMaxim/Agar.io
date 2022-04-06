const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');
const ORM = require('./ORM');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator){
        this.mediator = mediator;
        
        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.orm = new ORM(this.db);

        setTimeout(() => {})
    }

    destructor() {
        if(this.db){
          this.db.close();
          this.db = null;   
        }
    }

    _getUserById(socket_id) {
        return this.orm.get('users', {socket_id});
    }

    async _getUserByNick(nick){
        let a = await this.orm.all('users');
        console.log(a);
    }

    async registration(data = {}, socket){
        const status = await this.orm.insert('users', data);
        socket.emit(this.SOCKET.REGISTRATION, {status});
    }

    async login(data = {}, socket){
        const { nick, hash, rand } = data;
        const user = await this.db._getUserByNick(nick);
        let status = false;
        if (user && hash === md5(user.hash + rand)){
            this.users[socket.id] = user;
            status = true;
        }
        socket.emit(this.SOCKET.LOGIN, {status});
    }

}

module.exports = DB;