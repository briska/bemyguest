const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const update = require('react-addons-update');
const moment = require('moment');
require('moment/locale/sk');

let GuestsStore = createStore({
    storeName: 'GuestsStore',

    initialize: function() {
        this._guests = [];
        this._updated = moment();
    },

    getGuests: function(guestIds) {
        if (!guestIds) return this._guests;
        return _.filter(this._guests, (guest) => {return guestIds.indexOf(guest.id) >= 0;});
    },

    getGuest: function(guestId) {
        return _.find(this._guests, {id: guestId});
    },

    getGuestsByMatch: function(namePart, surnamePart) {
        namePart = namePart.toLowerCase();
        surnamePart = surnamePart.toLowerCase();
        let suggestions = _.filter(this._guests, function (guest) {
            let nameContains = _.isEmpty(namePart) || 0 === guest.name.toLowerCase().indexOf(namePart);
            let surnameContains = _.isEmpty(surnamePart) || 0 === guest.surname.toLowerCase().indexOf(surnamePart);
            return nameContains && surnameContains;
        });
        return suggestions;
    },

    getUpdated: function() {
        return this._updated;
    },

    handleGuest: function(guest) {
        if (!_.isEmpty(guest.visits)) {
            guest.visits = _.map(guest.visits, (visit) => {
                return {
                    dateFrom: moment(visit.dateFrom),
                    dateTo: moment(visit.dateTo),
                    id: visit.id
                };
            });
        }
        return guest;
    },

    setUpdated: function() {
        this._updated = moment();
    },

    handlers: {
        'GUESTS_LOADED': function({guests}) {
            this._guests = _.map(guests, (guest, i) => {
                guest = this.handleGuest(guest);
                return guest;
            });
            this.setUpdated();
            this.emitChange();
        },

        'GUESTS_EDITED': function({guest}) {
            guest = this.handleGuest(guest);
            let index = _.findIndex(this._guests, {id: guest.id});
            this._guests = update(this._guests, {[index]: {$set: guest}});
            this.setUpdated();
            this.emitChange();
        },

        'GUESTS_REMOVED': function({id}) {
            this._guests = _.filter(this._guests, (guest) => {return guest.id != id;});
            this.setUpdated();
            this.emitChange();
        },

        'GUESTS_ERROR': function() {
            this.emitChange();
        }
    },

    dehydrate: function() {
        return {
            guests: this._guests
        };
    },

    rehydrate: function(state) {
        this._guests = state.guests;
    }
});

module.exports = GuestsStore;
