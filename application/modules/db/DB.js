const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');
const ORM = require('./ORM');

class DB {
    constructor({ HOST, NAME, USER, PASS }, mediator) {
        this.mediator = mediator;

        this.db = new sqlite3.Database(path.join(__dirname, NAME));
        this.orm = new ORM(this.db);
    }

    disconnect(nick) {
        this.orm.update('users', { nick }, { token: '' });
    }

    destructor() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    async getUserByNick(nick) {
        return await this.orm.get('users', { nick });
    }

    async registration(data = {}) {
        await this.orm.insert('users', data);
    }

    async setToken(id, token) {
        return await this.orm.update('users', { id }, { token });
    }
}

module.exports = DB;