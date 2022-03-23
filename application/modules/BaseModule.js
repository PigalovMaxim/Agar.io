class BaseModule {
    constructor({ mediator, io }) {
        this.io = io;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggerTypes();
        this.EVENTS = mediator.getEventTypes();
    }
}

module.exports = BaseModule