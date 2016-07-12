const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const ReservationsStore = require('core/calendar/reservationsStore');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';

let SheetReservations = React.createClass({
    render: function() {
        let {context, dateFrom, dateTo, reservations} = this.props;
        let {rooms} = context;
        return (
            <div className='sheet-reservations'>
                {_.map(reservations, (reservation, i) => {
                    return (
                        _.map(reservation.roomReservations, (roomReservation) => {
                            let daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                            let reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
                            let roomIndex = _.findIndex(rooms, {'id': roomReservation.room});
                            return (
                                <div
                                    key={'reservation-' + roomReservation.id + '-' + reservation.id}
                                    className={cx('calendar-reservation', 'reservation-' + (i + 1))}
                                    style={{
                                        width: reservationDays * cellWidth + 'px',
                                        height: cellHeight + 'px',
                                        left: daysFromStart * cellWidth + 'px',
                                        top: headHeight + monthHeight + roomIndex * cellHeight + 'px'}}>
                                    <div className="reservation-body">
                                        <span className="contact-name">{reservation.contactName}</span>
                                        <span className="contact-mail">{reservation.contactMail}</span>
                                        <span className="contact-phone">{reservation.contactPhone}</span>
                                    </div>
                                </div>
                            );
                        })
                    );
                })}
            </div>
        );
    }
});

SheetReservations = connectToStores(SheetReservations, [ReservationsStore], (context, props) => ({
    reservations: context.getStore(ReservationsStore).getReservations()
}));

module.exports = provideContext(SheetReservations);
