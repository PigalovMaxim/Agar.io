const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Socket } = require('socket.io');
const md5 = require('md5');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator){
        this.mediator = mediator;
        //this.db.get();
        //this.db.run();
        //this.db.all();
        
        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.mediator.subscribe(this.mediator.EVENTS.USER_REGISTRATION, (data) => this.registration(data));
        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_NICK, nick => this._getUserByNick(nick));
        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_ID, id => this._getUserById(id));
        this.mediator.set(this.mediator.TRIGGERS.LOGIN, data => this.login(data));
    }
    
    destructor() {
        if(this.db){
          this.db.close();
          this.db = null;   
        }
    }

    login({id,nick}){
        new Promise(resolve => {
            this.db.serialize(() => {
                const query = "UPDATE users SET socket_id=? WHERE nick=?";
                this.db.get(
                    query,
                    [id, nick],
                    (err, row) => resolve(err ? null : row)
                );
            });
        });
        return this._getUserByNick(nick);
    }

    _getUserById(id) {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const query = "SELECT * FROM users WHERE socket_id=?";
                this.db.get(
                    query,
                    [id],
                    (err, row) => resolve(err ? null : row)
                );
            });
        });
    }

    _getUserByNick(nick){
        return new Promise(resolve => {
            this.db.serialize(() => {
                const query = "SELECT * FROM users WHERE nick=?";
                this.db.get(
                    query,
                    [nick],
                    (err, row) => resolve(err ? null : row)
                );
            });
        });
    }

    registration({nick, hash, id}){
        return new Promise(resolve=> {
            this.db.serialize(() =>{
                const query = "INSERT INTO users (nick, hash, socket_id) VALUES (?, ?, ?)";
                this.db.run(query, [nick, hash, id], (err, row) => resolve(err ? null : row));
            });
        });
    }
}

module.exports = DB;

/*НЕ РАБОТАЕТ КНОПКА ЛОГИНА
*/