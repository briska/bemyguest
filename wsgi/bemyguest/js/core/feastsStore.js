const _ = require('lodash');
const createStore = require('fluxible/addons/createStore');
const moment = require('moment');

let FeastsStore = createStore({
    storeName: 'FeastsStore',
    
    initialize: function() {
        this._feasts = [];
    },
    
    getFeasts: function() {
        return this._feasts;
    },
    
    handlers: {
        'FEASTS_LOADED': function({feasts}) {
            this._feasts = feasts;
            this._feasts = _.fromPairs(
                    _.map(feasts, (feast) => {  
                        return [moment(feast.date).format('L'), feast];
                    })
            );
            this.emitChange();
        }
    },
    
    dehydrate: function() {
        return {
            feasts: this._feasts
        };
    },
    
    rehydrate: function(state) {
        this._feasts = state.feasts;
    }
});

module.exports = FeastsStore;
