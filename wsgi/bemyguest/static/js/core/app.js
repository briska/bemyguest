'use strict';

var _feastsStore = require('core/feastsStore');

var _feastsStore2 = _interopRequireDefault(_feastsStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
app.registerStore(_feastsStore2.default);

module.exports = app;