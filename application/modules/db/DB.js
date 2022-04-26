//const sqlite3 = require('sqlite3').verbose();
//const path = require('path');

const { Client } = require('pg');
const ORM = require('./ORM');

class DB {
    constructor(
        { HOST, NAME, USER, PASS, PORT }, 
        mediator, 
        initCB = () => null
    ) {
        this.mediator = mediator;

        this.db = new Client({
            host: HOST,
            port: PORT,
            database: NAME,
            user: USER,
            password: PASS
        });
        (async () => {
            await this.db.connect();
            this.orm = new ORM(this.db);
            initCB();
        })();
    }

    destructor() {
        if (this.db) {
            this.db.end();
            this.db = null;
        }
    }
    // ДИНАР ВЗЯЛ НА СЕБЯ ОТВЕТСТВЕННОСТЬ СДЕЛАТЬ ВСЁ ЗА МЕНЯ
    // ЕСЛИ ТУТ НЕ БУДЕТ НОРМЛЬНОГО КОДА К 26.04.22 ТО ДИНАР
    // МНЕ БУДЕТ ДОЛЖЕН 300 РОССИЙСКИХ РУБЛЕЙ
    async getUser(guid) {
        const query = 'SELECT * FROM users WHERE guid=$1';
        const result = await this.db.query(query, [guid]);
        return result?.rows?.[0] || null;
    }

    disconnect(nick) {
        this.orm.update('users', { nick }, { token: '' });
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