'use strict';

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

    deselectRoom: function deselectRoom(room) {
        this._roomReservations = _.filter(this._roomReservations, function (roomReservation) {
            return roomReservation.room != room;
        });
        this.emitChange();
    },

    selectRoom: function selectRoom(room, date) {
        var roomReservation = _.find(this._roomReservations, { room: room });
        if (roomReservation) {
            if (date < roomReservation.dateFrom) roomReservation.dateFrom = date;else if (date > roomReservation.dateTo) roomReservation.dateTo = date;
        } else this._roomReservations = _.concat(this._roomReservations, { room: room, dateFrom: date, dateTo: date });
        this.emitChange();
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