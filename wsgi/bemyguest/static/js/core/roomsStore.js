'use strict';

var _ = require('lodash');
var createStore = require('fluxible/addons/createStore');

var RoomsStore = createStore({
    storeName: 'CommonStore',

    initialize: function initialize() {
        var _this = this;

        // TODO: validate requestData (or find better way)
        this._houses = requestData.houses;
        this._rooms = _.map(requestData.rooms, function (room) {
            room.house = _.find(_this._houses, { 'id': room.houseId });
            return room;
        });
    },

    getHouses: function getHouses() {
        return this._houses;
    },

    getRooms: function getRooms(roomIds) {
        if (!roomIds) return this._rooms;
        return _.filter(this._rooms, function (room) {
            return roomIds.indexOf(room.id) >= 0;
        });
    },

    getHouse: function getHouse(houseId) {
        return _.find(this._houses, { 'id': houseId });
    },

    getRoom: function getRoom(roomId) {
        return _.find(this._rooms, { 'id': roomId });
    },

    getRoomIndex: function getRoomIndex(roomId) {
        return _.findIndex(this._rooms, { 'id': roomId });
    },

    dehydrate: function dehydrate() {
        return {
            houses: this._houses,
            rooms: this._rooms
        };
    },

    rehydrate: function rehydrate(state) {
        this._houses = state.houses;
        this._rooms = state.rooms;
    }
});

module.exports = RoomsStore;