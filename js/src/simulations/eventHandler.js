// Events are in the form [type, parameters]

const EventHander = {
    events: [],
    listeners: {},

    // Make <obj> a listener for event of <type>
    // When it hears the event, it calls the <func>
    addEventListener: function(type, obj, func) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(func.bind(obj));
    },

    update: function() {
        this.events.forEach((type, param) => {
            listenersForEvent = this.listeners[type] || [];
            listenersForEvent.forEach(listener => {
                listener(param);
            });
        });
        // Clear processed events
        this.events = [];
    },
};
