const createStore = require('fluxible/addons/createStore');
const moment = require('moment');
require('moment/locale/sk');

let NewReservationStore = createStore({
    storeName: 'NewReservationStore',
    
    initialize: function() {
        this._roomReservations = [];
    },
    
    getRoomReservations: function() {
        return this._roomReservations;
    },
    
    deselectRoom: function(room) {
        this._roomReservations = _.filter(this._roomReservations, function(roomReservation) {return roomReservation.room != room;});
        this.emitChange();
    },
    
    selectRoom: function(room, date) {
        let roomReservation = _.find(this._roomReservations, {room: room});
        if (roomReservation) {
            if (date < roomReservation.dateFrom) roomReservation.dateFrom = date;
            else if (date > roomReservation.dateTo) roomReservation.dateTo = date;
        }
        else this._roomReservations = _.concat(this._roomReservations, {room: room, dateFrom: date, dateTo: date});
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
