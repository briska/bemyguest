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
        if (resp.body && resp.body.error == 'wrongCredentials') {
            actionContext.dispatch('USER_ERROR');
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
        actionContext.executeAction(loadGuests);
        done();
    });
};

function editReservation(actionContext, {id, data}, done) {
    xhr.post(actionContext, '/api/reservations/' + id + '/', data, function(resp) {
        actionContext.dispatch('RESERVATION_EDITED', {reservation: resp.body.reservation});
        actionContext.executeAction(loadGuests);
        done();
    }, function(resp) {
        actionContext.dispatch('RESERVATION_ERROR');
    });
};

function removeReservation(actionContext, {id, data}, done) {
    xhr.delete(actionContext, '/api/reservations/' + id + '/', data, function(resp) {
        actionContext.dispatch('RESERVATION_REMOVED', {id: id});
        actionContext.executeAction(loadGuests);
        done();
    });
};

function loadEvents(actionContext, {}, done) {
    xhr.get(actionContext, '/api/events/', function(resp) {
        actionContext.dispatch('EVENTS_LOADED', {events: resp.body.events});
        done();
    });
};

function createEvent(actionContext, payload, done) {
    xhr.post(actionContext, '/api/events/', payload, function(resp) {
        actionContext.dispatch('EVENT_CREATED', {event: resp.body.event});
        done();
    });
};

function editEvent(actionContext, {event}, done) {
    xhr.post(actionContext, '/api/events/' + event.id + '/', event, function(resp) {
        actionContext.dispatch('EVENT_EDITED', {event: resp.body.event});
        done();
    }, function(resp) {
        actionContext.dispatch('EVENT_ERROR');
    });
};

function removeEvent(actionContext, {id, data}, done) {
    xhr.delete(actionContext, '/api/events/' + id + '/', data, function(resp) {
        actionContext.dispatch('EVENT_REMOVED', {id: id});
        done();
    });
};

function loadGuests(actionContext, {}, done) {
    xhr.get(actionContext, '/api/guests/', function(resp) {
        actionContext.dispatch('GUESTS_LOADED', {guests: resp.body.guests});
        done();
    });
};

function editGuest(actionContext, {guest}, done) {
    xhr.post(actionContext, '/api/guests/' + guest.id + '/', guest, function(resp) {
        actionContext.dispatch('GUESTS_EDITED', {guest: resp.body.guest});
        done();
    }, function(resp) {
        actionContext.dispatch('GUESTS_ERROR');
    });
};

module.exports = {loadUser, logIn, loadReservations, createReservation, editReservation, removeReservation, loadEvents, createEvent, editEvent, removeEvent, loadGuests, editGuest};
