class ORM {
    constructor(db) {
        this.db = db;
    }

    //Получение одной записи
    async get(tables, params = {}, fields = '*', operand = 'AND') {
        const str = Object.keys(params).map((key, index) => `${key}=$${index+1}`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            SELECT ${fields} 
            FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        const result = await this.db.query(query, arr);
        return result?.rows?.[0] || null;
    }

    async all(tables, params = {}, fields = '*', operand = 'AND') {
        const str = Object.keys(params).map((key, index) => `${key}=$${index+1}`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            SELECT ${fields} 
            FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        const result = await this.db.query(query, arr);
        return result?.rows || null;
    }

    async delete(tables, params = {}, operand = 'AND') {
        const str = Object.keys(params).map((key, index) => `${key}=$${index+1}`).join(` ${operand} `);
        const arr = Object.values(params);
        const query = `
            DELETE FROM ${tables instanceof Array ? tables.join(', ') : tables} 
            ${str.length === 0 ? '' : `WHERE ${str}`}`;
        await this.db.query(query, arr);
        return true;
    }

    async update(tables, whereParams = {}, setParams = {}, operand = 'AND') {
        const whereStr = Object.keys(whereParams).map(key => `${key}=?`).join(` ${operand} `);
        const whereArr = Object.values(whereParams);
        const setStr = Object.keys(setParams).map(key => `${key}=?`).join(`, `);
        const setArr = Object.values(setParams);
        const query = `
            UPDATE ${tables instanceof Array ? tables.join(', ') : tables} 
            SET ${setStr}
            ${whereStr.length === 0 ? '' : `WHERE ${whereStr}`}`;
        await this.db.query(query, whereArr, setArr);
        return true;
    }

    async insert(table, params = {}) {
        const str = Object.keys(params).join(`, `);
        const arr = Object.values(params).map((a, index) =>`$${index + 1}::text`);
        const query = `INSERT INTO ${table}(${str}) VALUES (${arr.join(', ')})`;
        await this.db.query(query, Object.values(params));
        return true;
    }
}

module.exports = ORM;