class ORM {
    constructor(db) {
        this.db = db;
    }

    //Получение одной записи
    get(tables, params = {}, fields = '*', operand = 'AND') {
        const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            SELECT ${fields} 
            FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        const result = this.db.query(query, arr);
        return result?.rows[0] || null;
    }

    all(tables, params = {}, fields = '*', operand = 'AND') {
        const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            SELECT ${fields} 
            FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        const result = this.db.query(query, arr);
        return result?.rows || null;
    }

    delete(tables, params = {}, operand = 'AND') {
        const str = Object.keys(params).map(key => `${key}=?`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            DELETE FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        this.db.query(query, arr);
        return true;
    }

    update(tables, whereParams = {}, setParams = {}, operand = 'AND') {
        const whereStr = Object.keys(whereParams).map(key => `${key}=?`).join(` ${operand} `);
        const whereArr = Object.values(whereParams);
        const setStr = Object.keys(setParams).map(key => `${key}=?`).join(`, `);
        const setArr = Object.values(setParams);
        const query = `
            UPDATE ${tables instanceof Array ? tables.join(', ') : tables} 
            SET ${setStr}
            ${whereStr.length === 0 ? '' : `WHERE ${whereStr}`}`;
        this.db.query(query, whereArr, setArr);
        return true;
    }

    insert(table, params = {}) {
        const str = Object.keys(params).join(`, `);
        const arr = Object.values(params);
        const questionMarks = [];
        arr.forEach(a => questionMarks.push('?'));
        const query = `
            INSERT INTO ${table} (${str})
            ${arr.length === 0 ? '' : `VALUES (${questionMarks.join(', ')})`}`;
        this.db.query(query, arr);
        return true;
    }
}

module.exports = ORM;