const createStore = require('fluxible/addons/createStore');

let UserStore = createStore({
    storeName: 'UserStore',

    initialize: function() {
        this._user = null;
        this._loggedOut = false;
        this._error = false;
    },

    getUser: function() {
        return this._user;
    },

    isLoggedOut: function() {
        return this._loggedOut;
    },

    hasError: function() {
        return this._error;
    },

    handlers: {
        'USER_LOADED': function({user}) {
            this._user = user;
            this._loggedOut = false;
            this._error = false;
            this.emitChange();
        },
        'USER_LOGGED_OUT': function() {
            this._loggedOut = true;
            this.emitChange();
        },
        'USER_ERROR': function() {
            this._error = true;
            this.emitChange();
        }
    },

    dehydrate: function() {
        return {
            user: this._user,
            loggedOut: this._loggedOut,
            error: this._error
        };
    },

    rehydrate: function(state) {
        this._user = state.user;
        this._loggedOut = state.loggedOut;
        this._error = state.error;
    }
});

module.exports = UserStore;
