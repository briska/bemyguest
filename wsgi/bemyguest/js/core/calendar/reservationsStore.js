const createStore = require('fluxible/addons/createStore');
const moment = require('moment');
require('moment/locale/sk');

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
            this._reservations = _.map(reservations, (reservation) => {
                reservation.roomReservations = _.map(reservation.roomReservations, (roomReservation) => {
                    roomReservation.dateFrom = moment(roomReservation.dateFrom);
                    roomReservation.dateTo = moment(roomReservation.dateTo);
                    return roomReservation;
                });
                return reservation;
            });
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
