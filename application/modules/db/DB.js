const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DB {
    constructor({ HOST, NAME, USER, PASS }){

        //this.db.get();
        //this.db.run();
        //this.db.all();
        
        this.db = new sqlite3.Database(path.join(__dirname, NAME));
    }
    destructor() {
        if(this.db){
          this.db.close();
          this.db = null;   
        }
    }
    getUserByLogin(login){
        return new Promise(resolve => {
            this.db.serialize(() => {
                const query = "SELECT * FROM users WHERE login=?";
                this.db.get(
                    query,
                    [login],
                    (err, row) => resolve(err ? null : row)
                );
            });
        });
    }
}

module.exports = DB;