const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const moment = require('moment');
require('moment/locale/sk');
import {DRAG_TYPE} from 'core/enums';

let NewReservationStore = createStore({
    storeName: 'NewReservationStore',

    initialize: function() {
        this._roomReservations = [];
    },

    getRoomReservations: function() {
        return this._roomReservations;
    },

    getRoomReservation: function(roomId) {
        return _.find(this._roomReservations, {roomId: roomId});
    },

    handlers: {
        'RESERVATION_CREATED': function({reservation}) {
            this._roomReservations = [];
            this.emitChange();
        }
    },

    deselectRoom: function(roomId) {
        if (_.findIndex(this._roomReservations, {roomId: roomId}) >= 0) {
            this._roomReservations = _.filter(this._roomReservations, function(roomReservation) {return roomReservation.roomId != roomId;});
            this.emitChange();
        }
    },

    selectRoom: function(roomId, date) {
        let roomReservation = _.find(this._roomReservations, {roomId: roomId});
        if (roomReservation) {
            if (date < roomReservation.dateFrom) roomReservation.dateFrom = date;
            else if (date > roomReservation.dateTo) roomReservation.dateTo = date;
        }
        else {
            this._roomReservations = _.concat(this._roomReservations, {roomId: roomId, dateFrom: date, dateTo: date});
        }
        this.emitChange();
    },

    getRoomReservationDays: function(roomId) {
        let roomReservation = _.find(this._roomReservations, {roomId: roomId});
        if (!roomReservation) {
            return 0;
        }
        return moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
    },

    setRoomReservationDays: function(roomId, days) {
        let roomReservation = _.find(this._roomReservations, {roomId: roomId});
        if (roomReservation) {
            roomReservation.dateTo = moment(roomReservation.dateFrom).add(days, 'days');
        }
        this.emitChange();
    },

    addRoomReservationDays: function(roomId, days, dragType) {
        let roomReservation = _.find(this._roomReservations, {roomId: roomId});
        if (roomReservation) {
            if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
                roomReservation.dateFrom = moment(roomReservation.dateFrom).add(days, 'days');
            }
            if (dragType == DRAG_TYPE.RIGHT || dragType == DRAG_TYPE.MOVE) {
                roomReservation.dateTo = moment(roomReservation.dateTo).add(days, 'days');
            }
        }
        this.emitChange();
    },

    dehydrate: function() {
        return {
            roomReservations: this._roomReservations
        };
    },

    rehydrate: function(state) {
        this._roomReservations = state.roomReservations;
    }
});

module.exports = NewReservationStore;
