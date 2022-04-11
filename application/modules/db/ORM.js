class ORM {
    constructor(db){
        this.db = db;
    }

    //Получение одной записи
    get(tables, params = {}, fields = '*', operand = 'AND') {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
                const arr = Object.values(params);
                const query = `
                    SELECT ${fields} 
                    FROM ${tables instanceof Array ? tables.join(', ') : tables} 
                    ${str.length === 0 ? '' : `WHERE ${str}`}`;
                this.db.get(
                    query,
                    arr,
                    (err, row) => resolve(err ? null : row)
                );
            });
        });
    }

    all(tables, params = {}, fields = '*', operand = 'AND') {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
                const arr = Object.values(params);
                const query = `
                    SELECT ${fields} 
                    FROM ${tables instanceof Array ? tables.join(', ') : tables} 
                    ${str.length === 0 ? '' : `WHERE ${str}`}`;
                this.db.all(
                    query,
                    arr,
                    (err, rows) => resolve(err ? [] : rows)
                );
            });
        });
    }


    delete(tables, params = {}, operand = 'AND') {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
                const arr = Object.values(params);
                const query = `
                    DELETE FROM ${tables instanceof Array ? tables.join(', ') : tables} 
                    ${str.length === 0 ? '' : `WHERE ${str}`}`;
                this.db.run(
                    query,
                    arr,
                    (err) => resolve(!err)
                );
            });
        });
    }

    update(tables, whereParams = {}, setParams = {}, operand = 'AND') {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const whereStr = Object.keys(whereParams).map(key => `${key}=?`).join(` ${operand} `);
                const whereArr = Object.values(whereParams);
                const setStr = Object.keys(setParams).map(key => `${key}=?`).join(`, `);
                const setArr = Object.values(setParams);
                const query = `
                    UPDATE ${tables instanceof Array ? tables.join(', ') : tables} 
                    SET ${setStr}
                    ${whereStr.length === 0 ? '' : `WHERE ${whereStr}`}`;
                this.db.run(
                    query,
                    [setArr ,whereArr],
                    (err) => resolve(!err)
                );
            });
        });
    }

    insert(table, whereParams = {}, params = {}, operand = 'AND') {
        return new Promise(resolve => {
            this.db.serialize(() => {
                const whereStr = Object.keys(whereParams).map(key => `${key}=?`).join(` ${operand} `);
                const whereArr = Object.values(whereParams);
                const str = Object.keys(params).join(`, `);
                const arr = Object.values(params);
                const questionMarks = [];
                arr.forEach(a => questionMarks.push('?'));
                const query = `
                    INSERT INTO ${table} (${str})
                    ${arr.length === 0 ? '' : `VALUES (${questionMarks.join(', ')})`}
                    ${whereStr.length === 0 ? '' : `WHERE ${whereStr}`}`;
                this.db.run(
                    query,
                    [arr, whereArr],
                    (err) => resolve(!err)
                );
            });
        });
    }
}

module.exports = ORM;