const xhr = require('core/utils/xhr');

function loadUser(actionContext, {}, done) {
    xhr.get(actionContext, '/api/user/', function(resp) {
        actionContext.dispatch('USER_LOADED', {user: resp.body.user});
        done();
    });
};

function logIn(actionContext, payload, done) {
    xhr.post(actionContext, '/api/login/', payload, function(resp) {
        actionContext.dispatch('USER_LOADED', {user: resp.body.user});
        done();
    }, function(resp) {
        if (resp.body.error == 'wrongCredentials') {
            console.log('error');
        }
    });
};

function loadReservations(actionContext, {}, done) {
    xhr.get(actionContext, '/api/reservations/', function(resp) {
        actionContext.dispatch('RESERVATIONS_LOADED', {reservations: resp.body.reservations});
        done();
    });
};

module.exports = {loadUser, logIn, loadReservations};
