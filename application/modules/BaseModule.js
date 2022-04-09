class BaseModule {
    constructor({ mediator, io, db, SOCKET}) {
        this.io = io;
        this.db = db;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggerTypes();
        this.SOCKETS = mediator.getSocketTypes();
        this.EVENTS = mediator.getEventTypes();
    }
}

module.exports = BaseModule;