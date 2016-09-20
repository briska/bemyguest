const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const moment = require('moment');
require('moment/locale/sk');
const update = require('react-addons-update');
import randomColor from 'randomcolor';
import {shouldBeApproved, diffDays} from 'core/utils/utils';

let ReservationsStore = createStore({
    storeName: 'ReservationsStore',

    initialize: function() {
        this._reservations = [];
    },

    getReservations: function() {
        return this._reservations;
    },

    getReservation: function(reservationId) {
        return _.find(this._reservations, {id: reservationId});
    },

    getRoomReservation: function(reservationId, roomReservationId) {
        return _.find(this.getReservation(reservationId).roomReservations, {id: roomReservationId});
    },

    handleReservation: function(reservation) {
        reservation.dateCreated = moment(reservation.dateCreated);
        reservation.dateFrom = null;
        reservation.dateTo = null;
        if (!_.isEmpty(reservation.roomReservations)) {
            reservation.dateFrom = moment(reservation.roomReservations[0].dateFrom);
            reservation.dateTo = moment(reservation.roomReservations[0].dateTo);
            reservation.roomReservations = _.map(reservation.roomReservations, (roomReservation) => {
                roomReservation.dateFrom = moment(roomReservation.dateFrom);
                roomReservation.dateTo = moment(roomReservation.dateTo);
                if (roomReservation.dateFrom.isBefore(reservation.dateFrom)) {
                    reservation.dateFrom = roomReservation.dateFrom;
                }
                if (roomReservation.dateTo.isAfter(reservation.dateTo)) {
                    reservation.dateTo = roomReservation.dateTo;
                }
                return roomReservation;
            });
        }
        reservation.approved = reservation.approved || !shouldBeApproved(diffDays(reservation.dateFrom, reservation.dateTo));
        reservation.meals = _.fromPairs(_.map(reservation.meals, (meal) => {
            return [moment(meal.date).format('DD/MM/YYYY'), meal.counts];
        }));
        return reservation;
    },

    handlers: {
        'RESERVATIONS_LOADED': function({reservations}) {
            let colors = randomColor({luminosity: 'light', count: _.size(reservations), seed: 'marek&majka'});
            this._reservations = _.map(reservations, (reservation, i) => {
                reservation = this.handleReservation(reservation);
                reservation.color = colors[i];
                return reservation;
            });
            this.emitChange();
        },

        'RESERVATION_CREATED': function({reservation}) {
            reservation = this.handleReservation(reservation);
            reservation.color = randomColor({luminosity: 'light'});
            this._reservations = _.concat(this._reservations, reservation);
            this.emitChange();
        },

        'RESERVATION_EDITED': function({reservation}) {
            let oldReservation = _.find(this._reservations, {id: reservation.id});
            reservation = this.handleReservation(reservation);
            reservation.color = oldReservation.color;
            let index = _.findIndex(this._reservations, {id: reservation.id});
            this._reservations = update(this._reservations, {[index]: {$set: reservation}});
            this.emitChange();
        },

        'RESERVATION_REMOVED': function({id}) {
            this._reservations = _.filter(this._reservations, (reservation) => {return reservation.id != id;});
            this.emitChange();
        },

        'RESERVATION_ERROR': function() {
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
