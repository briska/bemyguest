'use strict';

var createStore = require('fluxible/addons/createStore');

var UserStore = createStore({
    storeName: 'UserStore',

    initialize: function initialize() {
        this._user = null;
        this._loggedOut = false;
    },

    getUser: function getUser() {
        return this._user;
    },

    isLoggedOut: function isLoggedOut() {
        return this._loggedOut;
    },

    handlers: {
        'USER_LOADED': function USER_LOADED(_ref) {
            var user = _ref.user;

            this._user = user;
            this._loggedOut = false;
            this.emitChange();
        },
        'USER_LOGGED_OUT': function USER_LOGGED_OUT() {
            this._loggedOut = true;
            this.emitChange();
        }
    },

    dehydrate: function dehydrate() {
        return {
            user: this._user
        };
    },

    rehydrate: function rehydrate(state) {
        this._user = state.user;
    }
});

module.exports = UserStore;