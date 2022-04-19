const md5 = require('md5');

class Common {

    // генерирует guid
    guid() {
        function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    // возвращает дату в красивом виде (зачем?)
    getDate(separator) {
        separator = separator || '-';
        const d = new Date();
        const currDay = d.getDate();
        const currMonth = d.getMonth() + 1;
        const currYear = d.getFullYear();
        return currYear + separator + ((currMonth < 10) ? '0' + currMonth : currMonth) + separator + ((currDay < 10) ? '0' + currDay : currDay);
    }

    // генерирует рандомное число (строку)
    random(max = 1000000) {
        return Math.round(Math.random() * max).toString();
    }

    // генерирует рандомленный хеш
    genHash(text, max) {
        return md5(text + this.random(max));
    }

    getMD5(text) {
        return md5(text);
    }

    // возвращает контрольную сумму хеша, 
    // сформированную по правилу hash = md5(token + строка(guid=значение;rnd=значение))
    getHash(token, params = {}) {
        return this.getMD5(token + Object.keys(params)
            .sort()
            .reduce((acc, key) => acc += params[key] ? `${key}=${params[key]};` : '', ''));
    }
}

module.exports = Common;