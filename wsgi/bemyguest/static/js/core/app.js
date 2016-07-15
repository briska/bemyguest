'use strict';

var Fluxible = require('fluxible');
var RoomsStore = require('core/roomsStore');
var UserStore = require('core/user/userStore');
var ReservationsStore = require('core/calendar/reservationsStore');
var NewReservationStore = require('core/calendar/newReservationStore');
var Page = require('core/page');

var app = new Fluxible({
    component: Page
});

app.registerStore(RoomsStore);
app.registerStore(UserStore);
app.registerStore(ReservationsStore);
app.registerStore(NewReservationStore);

module.exports = app;