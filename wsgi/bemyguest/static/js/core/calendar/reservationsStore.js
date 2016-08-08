'use strict';

var _randomcolor = require('randomcolor');

var _randomcolor2 = _interopRequireDefault(_randomcolor);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var createStore = require('fluxible/addons/createStore');
var moment = require('moment');
require('moment/locale/sk');
var update = require('react-addons-update');


var ReservationsStore = createStore({
    storeName: 'ReservationsStore',

    initialize: function initialize() {
        this._reservations = [];
    },

    getReservations: function getReservations() {
        return this._reservations;
    },

    handleReservation: function handleReservation(reservation) {
        reservation.dateCreated = moment(reservation.dateCreated);
        reservation.dateFrom = null;
        reservation.dateTo = null;
        if (!_.isEmpty(reservation.roomReservations)) {
            reservation.dateFrom = moment(reservation.roomReservations[0].dateFrom);
            reservation.dateTo = moment(reservation.roomReservations[0].dateTo);
            reservation.roomReservations = _.map(reservation.roomReservations, function (roomReservation) {
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
        reservation.approved = reservation.approved || !(0, _utils.shouldBeApproved)((0, _utils.diffDays)(reservation.dateFrom, reservation.dateTo));
        reservation.meals = _.fromPairs(_.map(reservation.meals, function (meal) {
            return [moment(meal.date), meal.counts];
        }));
        return reservation;
    },

    handlers: {
        'RESERVATIONS_LOADED': function RESERVATIONS_LOADED(_ref) {
            var _this = this;

            var reservations = _ref.reservations;

            var colors = (0, _randomcolor2.default)({ luminosity: 'light', count: _.size(reservations), seed: 'marek&majka' });
            this._reservations = _.map(reservations, function (reservation, i) {
                reservation = _this.handleReservation(reservation);
                reservation.color = colors[i];
                return reservation;
            });
            this.emitChange();
        },

        'RESERVATION_CREATED': function RESERVATION_CREATED(_ref2) {
            var reservation = _ref2.reservation;

            reservation = this.handleReservation(reservation);
            reservation.color = (0, _randomcolor2.default)({ luminosity: 'light' });
            this._reservations = _.concat(this._reservations, reservation);
            this.emitChange();
        },

        'RESERVATION_EDITED': function RESERVATION_EDITED(_ref3) {
            var reservation = _ref3.reservation;

            var oldReservation = _.find(this._reservations, { id: reservation.id });
            reservation = this.handleReservation(reservation);
            reservation.color = oldReservation.color;
            var index = _.findIndex(this._reservations, { id: reservation.id });
            this._reservations = update(this._reservations, _defineProperty({}, index, { $set: reservation }));
            this.emitChange();
        },

        'RESERVATION_REMOVED': function RESERVATION_REMOVED(_ref4) {
            var id = _ref4.id;

            this._reservations = _.filter(this._reservations, function (reservation) {
                return reservation.id != id;
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