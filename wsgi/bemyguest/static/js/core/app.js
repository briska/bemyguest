'use strict';

var Fluxible = require('fluxible');
var ReservationsStore = require('core/calendar/reservationsStore');
var NewReservationStore = require('core/calendar/newReservationStore');
var UserStore = require('core/user/userStore');
var Page = require('core/page');

var app = new Fluxible({
    component: Page
});

app.registerStore(ReservationsStore);
app.registerStore(NewReservationStore);
app.registerStore(UserStore);

module.exports = app;