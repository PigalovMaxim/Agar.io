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

        /*this.db = new Client({
            host: HOST,
            port: PORT,
            database: NAME,
            user: USER,
            password: PASS,
        });
        (async () => {
            await this.db.connect();
            this.orm = new ORM(this.db);
            initCB();
        })();*/
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
        return result?.rows[0] || null;
    }


    async getUserByNick(nick) {
        return await this.orm.get('users', { nick });
    }

    registration(data = {}) {
        this.orm.insert('users', data);
    }

     setToken(id, token) {
        return  this.orm.update('users', { id }, { token });
    }

    async test(){
        return await this.orm.all('users');
    }
}

module.exports = DB;