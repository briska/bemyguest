'use strict';

var _ = require('lodash');
var createStore = require('fluxible/addons/createStore');
var moment = require('moment');

var FeastsStore = createStore({
    storeName: 'FeastsStore',

    initialize: function initialize() {
        this._feasts = [];
    },

    getFeasts: function getFeasts() {
        return this._feasts;
    },

    handlers: {
        'FEASTS_LOADED': function FEASTS_LOADED(_ref) {
            var feasts = _ref.feasts;

            this._feasts = feasts;
            this._feasts = _.fromPairs(_.map(feasts, function (feast) {
                return [moment(feast.date).format('L'), feast];
            }));
            console.log(this._feasts);
            this.emitChange();
        }
    },

    dehydrate: function dehydrate() {
        return {
            feasts: this._feasts
        };
    },

    rehydrate: function rehydrate(state) {
        this._feasts = state.feasts;
    }
});

module.exports = FeastsStore;