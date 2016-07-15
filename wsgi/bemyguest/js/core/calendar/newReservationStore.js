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
    
    deselectRoom: function(roomId) {
        this._roomReservations = _.filter(this._roomReservations, function(roomReservation) {return roomReservation.room != roomId;});
        this.emitChange();
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
