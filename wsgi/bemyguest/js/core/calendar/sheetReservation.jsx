const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import SheetRoomReservation from 'core/calendar/sheetRoomReservation';
import ReservationDetails from 'core/calendar/ReservationDetails';
import {getDatesRange} from 'core/utils/utils';

let SheetReservation = React.createClass({
    render: function() {
        let {context, dateFrom, dateTo, reservation} = this.props;
        let datesRange = getDatesRange(reservation.dateFrom, reservation.dateTo);
        return (
            <div className='sheet-reservation'>
                <ReservationDetails
                    ref="reservationDetails"
                    context={context}
                    reservation={reservation} />
                {_.map(reservation.roomReservations, (roomReservation) => {
                    return (
                        <SheetRoomReservation
                            key={'room-reservation-' + roomReservation.id + '-' + reservation.id}
                            context={context}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            reservation={reservation}
                            roomReservation={roomReservation}
                            getReservationDetails={() => this.refs.reservationDetails.refs.wrappedElement} />
                    );
                })}
            </div>
        );
    }
});

module.exports = SheetReservation;
