const xhr = require('core/utils/xhr');

function loadReservations(actionContext, {}, done) {
    xhr.get('/api/reservations/', function(resp) {
        actionContext.dispatch('RESERVATIONS_LOADED', {reservations: resp.body.reservations});
        done();
    });
};

module.exports = {loadReservations};
