const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const update = require('react-addons-update');
const moment = require('moment');
require('moment/locale/sk');

let EventsStore = createStore({
    storeName: 'EventsStore',

    initialize: function() {
        this._eevents = [];
        this._parsedEvents = [];
    },

    getEvents: function() {
        return this._eevents;
    },

    getParsedEvents: function() {
        return this._parsedEvents;
    },

    updateParsedEvents: function(eevents) {
        let parsedEvents = {};
        _.forEach(eevents, function(eevent) {
            if (eevent.dateTo == null) {
                let dateKey = moment(eevent.dateFrom).format('L');
                if (!(dateKey in parsedEvents)) {
                    parsedEvents[dateKey] = {};
                }
                parsedEvents[dateKey][eevent.type] = eevent;
            } else {
                for (var m = moment(eevent.dateFrom); m.isSameOrBefore(moment(eevent.dateTo)); m.add(1, 'days')) {
                    let dateKey = moment(m).format('L');
                    if (!(dateKey in parsedEvents)) {
                        parsedEvents[dateKey] = {};
                    }
                    parsedEvents[dateKey][eevent.type] = eevent;
                }
            }
        });
        this._parsedEvents = parsedEvents;
    },

    handleEvent: function(event) {
        event.dateFrom = moment(event.dateFrom);
        event.dateTo = event.dateTo == null ? null : moment(event.dateTo);
        return event;
    },

    handlers: {
        'EVENTS_LOADED': function({events}) {
            let allEvents = {}
            this._eevents = _.map(events, (event, i) => {
                event = this.handleEvent(event);
                return event;
            });
            this.updateParsedEvents(this._eevents);
            this.emitChange();
        },

        'EVENT_CREATED': function({event}) {
            event = this.handleEvent(event);
            this._eevents = _.concat(this._eevents, event);
            this.updateParsedEvents(this._eevents);
            this.emitChange();
        },

        'EVENT_EDITED': function({event}) {
            event = this.handleEvent(event);
            let index = _.findIndex(this._eevents, {id: event.id});
            this._eevents = update(this._eevents, {[index]: {$set: event}});
            this.updateParsedEvents(this._eevents);
            this.emitChange();
        },

        'EVENT_REMOVED': function({id}) {
            this._eevents = _.filter(this._eevents, (eevent) => {return eevent.id != id;});
            this.updateParsedEvents(this._eevents);
            this.emitChange();
        },

        'EVENT_ERROR': function() {
            this.emitChange();
        }
    },

    dehydrate: function() {
        return {
            eevents: this._eevents,
            parsedEvents: this._parsedEvents
        };
    },

    rehydrate: function(state) {
        this._eevents = state.eevents;
        this._parsedEvents = state.parsedEvents;
    }
});

module.exports = EventsStore;
