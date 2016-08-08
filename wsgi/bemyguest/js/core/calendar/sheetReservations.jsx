const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const ReservationsStore = require('core/calendar/reservationsStore');
import SheetReservation from 'core/calendar/sheetReservation';

let SheetReservations = React.createClass({
    render: function() {
        let {context, dateFrom, dateTo, reservations} = this.props;
        return (
            <div className='sheet-reservations'>
                {_.map(reservations, (reservation, i) => {
                    return (
                        <SheetReservation
                            key={'reservation-' + reservation.id}
                            context={context}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            reservation={reservation} />
                    );
                })}
            </div>
        );
    }
});

SheetReservations = connectToStores(SheetReservations, [ReservationsStore], (context, props) => ({
    reservations: context.getStore(ReservationsStore).getReservations()
}));

module.exports = SheetReservations;
