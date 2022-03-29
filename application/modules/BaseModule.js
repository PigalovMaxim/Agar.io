class BaseModule {
    constructor({ mediator, io, db }) {
        this.io = io;
        this.db = db;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggerTypes();
        this.EVENTS = mediator.getEventTypes();
    }
}

module.exports = BaseModule