const Fluxible = require('fluxible');
const ReservationsStore = require('core/calendar/reservationsStore');
const NewReservationStore = require('core/calendar/newReservationStore');
const UserStore = require('core/user/userStore');
const Page = require('core/page');

let app = new Fluxible({
    component: Page
});

app.registerStore(ReservationsStore);
app.registerStore(NewReservationStore);
app.registerStore(UserStore);

module.exports = app;
