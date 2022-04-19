class BaseModule {
    constructor({ mediator, io, db, common }) {
        this.io = io;
        this.db = db;
        this.common = common;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggerTypes();
        this.SOCKETS = mediator.getSocketTypes();
        this.EVENTS = mediator.getEventTypes();
    }
}

module.exports = BaseModule;