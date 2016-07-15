const Fluxible = require('fluxible');
const RoomsStore = require('core/roomsStore');
const UserStore = require('core/user/userStore');
const ReservationsStore = require('core/calendar/reservationsStore');
const NewReservationStore = require('core/calendar/newReservationStore');
const Page = require('core/page');

let app = new Fluxible({
    component: Page
});

app.registerStore(RoomsStore);
app.registerStore(UserStore);
app.registerStore(ReservationsStore);
app.registerStore(NewReservationStore);

module.exports = app;
