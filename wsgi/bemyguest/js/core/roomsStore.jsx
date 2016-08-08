const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');

let RoomsStore = createStore({
    storeName: 'CommonStore',
    
    initialize: function() {
        // TODO: validate requestData (or find better way)
        this._houses = requestData.houses;
        this._rooms = _.map(requestData.rooms, (room) => {
            room.house = _.find(this._houses, {'id': room.houseId});
            return room;
        });
        
    },
    
    getHouses: function() {
        return this._houses;
    },
    
    getRooms: function(roomIds) {
        if (!roomIds) return this._rooms;
        return _.filter(this._rooms, (room) => {return roomIds.indexOf(room.id) >= 0;});
    },
    
    getHouse: function(houseId) {
        return _.find(this._houses, {'id': houseId});
    },
    
    getRoom: function(roomId) {
        return _.find(this._rooms, {'id': roomId});
    },
    
    getRoomIndex: function(roomId) {
        return _.findIndex(this._rooms, {'id': roomId});
    },
    
    dehydrate: function() {
        return {
            houses: this._houses,
            rooms: this._rooms
        };
    },
    
    rehydrate: function(state) {
        this._houses = state.houses;
        this._rooms = state.rooms;
    }
});

module.exports = RoomsStore;
