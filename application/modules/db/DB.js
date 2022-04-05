const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const ORM = require('./ORM');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator){
        this.mediator = mediator;
        
        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.orm = new ORM(this.db);
        setTimeout(() => this.insert({nick: 'OOOOOO', hash: 'asdasd', socket_id: 'asdasdawd'}), 2500);
        /* this.mediator.subscribe(this.mediator.EVENTS.USER_REGISTRATION, (data) => this.registration(data));
        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_NICK, nick => this._getUserByNick(nick));
        this.mediator.set(this.mediator.TRIGGERS.GET_USER_BY_ID, id => this._getUserById(id));
        this.mediator.set(this.mediator.TRIGGERS.LOGIN, data => this.login(data)); */
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

    _getUserById(socket_id) {
        return this.orm.get('users', {socket_id});
    }

    async _getUserByNick(nick){
        let a = await this.orm.all('users');
        console.log(a);
    }

    async deleteUser(params){
        let a = await this.orm.delete('users', params);
        console.log(a);
    }

    async changeParam(setParams, whereParams){
        let a = await this.orm.update('users', whereParams, setParams);
        console.log(a);
    }

    async insert(params){
        let a = await this.orm.insert('users', params);
        console.log(a);
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