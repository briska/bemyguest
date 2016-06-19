const createStore = require('fluxible/addons/createStore');

let ReservationsStore = createStore({
    storeName: 'ReservationsStore',

    initialize: function() {
        this._reservations = [];
    },

    getReservations: function() {
        return this._reservations;
    },
    
    handlers: {
        'RESERVATIONS_LOADED': function({reservations}) {
            this._reservations = reservations;
            this.emitChange();
        }
    },
    
    dehydrate: function() {
        return {
            reservations: this._reservations
        };
    },

    rehydrate: function(state) {
        this._reservations = state.reservations;
    }
});

module.exports = ReservationsStore;
