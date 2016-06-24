'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var xhr = require('core/utils/xhr');

function loadUser(actionContext, _ref, done) {
    _objectDestructuringEmpty(_ref);

    xhr.get(actionContext, '/api/user/', function (resp) {
        actionContext.dispatch('USER_LOADED', { user: resp.body.user });
        done();
    });
};

function logIn(actionContext, payload, done) {
    xhr.post(actionContext, '/api/login/', payload, function (resp) {
        actionContext.dispatch('USER_LOADED', { user: resp.body.user });
        done();
    }, function (resp) {
        if (resp.body.error == 'wrongCredentials') {
            console.log('error');
        }
    });
};

function loadReservations(actionContext, _ref2, done) {
    _objectDestructuringEmpty(_ref2);

    xhr.get(actionContext, '/api/reservations/', function (resp) {
        actionContext.dispatch('RESERVATIONS_LOADED', { reservations: resp.body.reservations });
        done();
    });
};

module.exports = { loadUser: loadUser, logIn: logIn, loadReservations: loadReservations };