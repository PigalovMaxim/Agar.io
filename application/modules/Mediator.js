class Mediator {
    constructor({ EVENTS, TRIGGERS }) {
        this.events = {}; // список событий
        this.triggers = {}; // список получателей данных
        this.EVENTS = EVENTS; // названия событий
        this.TRIGGERS = TRIGGERS; // названия получателей данных
        Object.values(this.EVENTS).forEach(value => this.events[value] = []);
        Object.values(this.TRIGGERS)
            .forEach(value => this.triggers[value] = () => null);
    }

    /******************/
    /* about triggers */
    /******************/
    getTriggerTypes() {
        return this.TRIGGERS;
    }

    set(name, func) {
        if (name && this.triggers[name] && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    get(name, data) {
        return (name && 
                this.triggers[name] && 
                this.triggers[name] instanceof Function) ? 
            this.triggers[name](data) : 
            null;
    }

    /****************/
    /* about events */
    /****************/
    getEventTypes() {
        return this.EVENTS;
    }

    subscribe(name, func) {
        if (name && this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    call(name, data) {
        if (name && this.events[name]) {
            this.events[name].forEach(func => {
                if (func instanceof Function) {
                    //console.log("name = "+ name + ", data = " + data);
                    func(data);
                }
            });
        }
    }
}

module.exports = Mediator;