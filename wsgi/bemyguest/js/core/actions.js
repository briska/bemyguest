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
            console.log('wrongCredentials');
        }
    });
};

function loadReservations(actionContext, {}, done) {
    xhr.get(actionContext, '/api/reservations/', function(resp) {
        actionContext.dispatch('RESERVATIONS_LOADED', {reservations: resp.body.reservations});
        done();
    });
};

function createReservation(actionContext, payload, done) {
    xhr.post(actionContext, '/api/reservations/', payload, function(resp) {
        actionContext.dispatch('RESERVATION_CREATED', {reservation: resp.body.reservation});
        done();
    });
};

function editReservation(actionContext, {id, data}, done) {
    xhr.post(actionContext, '/api/reservations/' + id + '/', data, function(resp) {
        actionContext.dispatch('RESERVATION_EDITED', {reservation: resp.body.reservation});
        done();
    });
};

function removeReservation(actionContext, {id, data}, done) {
    xhr.delete(actionContext, '/api/reservations/' + id + '/', data, function(resp) {
        actionContext.dispatch('RESERVATION_REMOVED', {id: id});
        done();
    });
};

module.exports = {loadUser, logIn, loadReservations, createReservation, editReservation, removeReservation};
