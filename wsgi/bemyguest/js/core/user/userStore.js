const createStore = require('fluxible/addons/createStore');

let UserStore = createStore({
    storeName: 'UserStore',

    initialize: function() {
        this._user = null;
        this._loggedOut = false;
    },

    getUser: function() {
        return this._user;
    },
    
    isLoggedOut: function() {
        return this._loggedOut;
    },
    
    handlers: {
        'USER_LOADED': function({user}) {
            this._user = user;
            this._loggedOut = false;
            this.emitChange();
        },
        'USER_LOGGED_OUT': function() {
            this._loggedOut = true;
            this.emitChange();
        }
    },
    
    dehydrate: function() {
        return {
            user: this._user
        };
    },

    rehydrate: function(state) {
        this._user = state.user;
    }
});

module.exports = UserStore;
