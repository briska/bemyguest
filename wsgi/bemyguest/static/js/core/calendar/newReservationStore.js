'use strict';

var _ = require('lodash');
var createStore = require('fluxible/addons/createStore');
var moment = require('moment');
require('moment/locale/sk');

var NewReservationStore = createStore({
    storeName: 'NewReservationStore',

    initialize: function initialize() {
        this._roomReservations = [];
    },

    getRoomReservations: function getRoomReservations() {
        return this._roomReservations;
    },

    handlers: {
        'RESERVATION_CREATED': function RESERVATION_CREATED(_ref) {
            var reservation = _ref.reservation;

            this._roomReservations = [];
            this.emitChange();
        }
    },

    deselectRoom: function deselectRoom(roomId) {
        if (_.findIndex(this._roomReservations, { roomId: roomId }) >= 0) {
            this._roomReservations = _.filter(this._roomReservations, function (roomReservation) {
                return roomReservation.roomId != roomId;
            });
            this.emitChange();
        }
    },

    selectRoom: function selectRoom(roomId, date) {
        var roomReservation = _.find(this._roomReservations, { roomId: roomId });
        if (roomReservation) {
            if (date < roomReservation.dateFrom) roomReservation.dateFrom = date;else if (date > roomReservation.dateTo) roomReservation.dateTo = date;
        } else {
            this._roomReservations = _.concat(this._roomReservations, { roomId: roomId, dateFrom: date, dateTo: date });
        }
        this.emitChange();
    },

    getRoomReservationDays: function getRoomReservationDays(roomId) {
        var roomReservation = _.find(this._roomReservations, { roomId: roomId });
        if (!roomReservation) {
            return 0;
        }
        return moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
    },

    dehydrate: function dehydrate() {
        return {
            roomReservations: this._roomReservations
        };
    },

    rehydrate: function rehydrate(state) {
        this._roomReservations = state.roomReservations;
    }
});

module.exports = NewReservationStore;