'use strict';

var createStore = require('fluxible/addons/createStore');
var moment = require('moment');
require('moment/locale/sk');

var ReservationsStore = createStore({
    storeName: 'ReservationsStore',

    initialize: function initialize() {
        this._reservations = [];
    },

    getReservations: function getReservations() {
        return this._reservations;
    },

    handlers: {
        'RESERVATIONS_LOADED': function RESERVATIONS_LOADED(_ref) {
            var reservations = _ref.reservations;

            this._reservations = _.map(reservations, function (reservation) {
                reservation.roomReservations = _.map(reservation.roomReservations, function (roomReservation) {
                    roomReservation.dateFrom = moment(roomReservation.dateFrom);
                    roomReservation.dateTo = moment(roomReservation.dateTo);
                    return roomReservation;
                });
                return reservation;
            });
            this.emitChange();
        }
    },

    dehydrate: function dehydrate() {
        return {
            reservations: this._reservations
        };
    },

    rehydrate: function rehydrate(state) {
        this._reservations = state.reservations;
    }
});

module.exports = ReservationsStore;