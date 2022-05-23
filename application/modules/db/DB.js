//const sqlite3 = require('sqlite3').verbose();
//const path = require('path');

const { Client } = require('pg');
const ORM = require('./ORM');

class DB {
    constructor(
        { HOST, NAME, USER, PASS, PORT },
        mediator,
    ) {
        this.mediator = mediator;

        this.db = new Client({
            host: HOST,
            port: PORT,
            database: NAME,
            user: USER,
            password: PASS,
        });
        (async () => {
            await this.db.connect();
            this.orm = new ORM(this.db);
        })();
    }

    destructor() {
        if (this.db) {
            this.db.end();
            this.db = null;
        }
    }
    async getUser(guid) {
        const query = 'SELECT * FROM users WHERE guid=$1';
        const result = await this.db.query(query, [guid]);
        return result?.rows[0] || null;
    }

    async getUserByNick(nick) {
        return await this.orm.get('users', { nick }); 
    }

    async registration(nick, hash, guid) {
        await this.orm.insert('users', { nick, hash, guid });
    }

    setToken(id, token) {
        return this.orm.update('users', { id }, { token });
    }

}

module.exports = DB;