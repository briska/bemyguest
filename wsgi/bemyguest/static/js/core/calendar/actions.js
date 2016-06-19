'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var xhr = require('core/utils/xhr');

function loadReservations(actionContext, _ref, done) {
    _objectDestructuringEmpty(_ref);

    xhr.get('/api/reservations/', function (resp) {
        actionContext.dispatch('RESERVATIONS_LOADED', { reservations: resp.body.reservations });
        done();
    });
};

module.exports = { loadReservations: loadReservations };