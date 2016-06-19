'use strict';

var Fluxible = require('fluxible');
var ReservationsStore = require('core/calendar/reservationsStore');

function getPage(page) {
    if (page == 'calendar') return require('core/calendar/calendar');else if (page == 'stats') return require('core/stats/stats');else return null;
};

if (!_.isString(page)) page = '';

var app = new Fluxible({
    component: getPage(page)
});

app.registerStore(ReservationsStore);

module.exports = app;