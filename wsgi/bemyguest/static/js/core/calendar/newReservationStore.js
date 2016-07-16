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

    deselectRoom: function deselectRoom(roomId) {
        this._roomReservations = _.filter(this._roomReservations, function (roomReservation) {
            return roomReservation.roomId != roomId;
        });
        this.emitChange();
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