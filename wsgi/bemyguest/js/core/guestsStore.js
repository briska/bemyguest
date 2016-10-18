const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const update = require('react-addons-update');

let GuestsStore = createStore({
    storeName: 'GuestsStore',

    initialize: function() {
        this._guests = [];
    },

    getGuests: function() {
        return this._guests;
    },

    getGuest: function(guestId) {
        return _.find(this._guests, {id: guestId});
    },

    handleGuest: function(guest) {
        return guest;
    },

    handlers: {
        'GUESTS_LOADED': function({guests}) {
            this._guests = _.map(guests, (guest, i) => {
                guest = this.handleGuest(guest);
                return guest;
            });
            this.emitChange();
        },

        'GUESTS_EDITED': function({guest}) {
            let oldGuest = _.find(this._guests, {id: guest.id});
            guest = this.handleGuest(guest);
            let index = _.findIndex(this._guests, {id: guest.id});
            this._guests = update(this._guests, {[index]: {$set: guest}});
            this.emitChange();
        },

        'GUESTS_REMOVED': function({id}) {
            this._guests = _.filter(this._guests, (guest) => {return guest.id != id;});
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
