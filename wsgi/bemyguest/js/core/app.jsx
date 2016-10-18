const Fluxible = require('fluxible');
const RoomsStore = require('core/roomsStore');
const UserStore = require('core/user/userStore');
const ReservationsStore = require('core/calendar/reservationsStore');
const NewReservationStore = require('core/calendar/newReservationStore');
import FeastsStore from 'core/feastsStore';
import GuestsStore from 'core/guestsStore';
const Page = require('core/page');

let app = new Fluxible({
    component: Page
});

app.registerStore(RoomsStore);
app.registerStore(UserStore);
app.registerStore(ReservationsStore);
app.registerStore(NewReservationStore);
app.registerStore(FeastsStore);
app.registerStore(GuestsStore);

module.exports = app;
