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
            console.log('wrongCredentials');
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

function createReservation(actionContext, payload, done) {
    xhr.post(actionContext, '/api/reservations/', payload, function (resp) {
        actionContext.dispatch('RESERVATION_CREATED', { reservation: resp.body.reservation });
        done();
    });
};

function editReservation(actionContext, _ref3, done) {
    var id = _ref3.id;
    var data = _ref3.data;

    xhr.post(actionContext, '/api/reservations/' + id + '/', data, function (resp) {
        actionContext.dispatch('RESERVATION_EDITED', { reservation: resp.body.reservation });
        done();
    });
};

function removeReservation(actionContext, _ref4, done) {
    var id = _ref4.id;
    var data = _ref4.data;

    xhr.delete(actionContext, '/api/reservations/' + id + '/', data, function (resp) {
        actionContext.dispatch('RESERVATION_REMOVED', { id: id });
        done();
    });
};

function loadFeasts(actionContext, _ref5, done) {
    _objectDestructuringEmpty(_ref5);

    xhr.get(actionContext, '/api/feasts/', function (resp) {
        actionContext.dispatch('FEASTS_LOADED', { feasts: resp.body.feasts });
        done();
    });
};

module.exports = { loadUser: loadUser, logIn: logIn, loadReservations: loadReservations, createReservation: createReservation, editReservation: editReservation, removeReservation: removeReservation, loadFeasts: loadFeasts };