const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const NewReservationStore = require('core/calendar/newReservationStore');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import {Glyphicon} from 'react-bootstrap';

let SheetNewReservation = React.createClass({
    deselectRoom: function(room) {
        this.props.context.getStore(NewReservationStore).deselectRoom(room);
    },
    
    render: function() {
        let {context, dateFrom, dateTo, roomReservations} = this.props;
        let {rooms} = this.props.context;
        return (
            <div className="sheet-new-reservation">
                {_.map(roomReservations, (roomReservation, i) => {
                    let daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                    let reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
                    let roomIndex = _.findIndex(rooms, {'id': roomReservation.room});
                    return (
                        <div
                            key={'new-reservation-' + i}
                            className={cx('calendar-reservation', 'reservation-new')}
                            style={{
                                width: reservationDays * cellWidth + 'px',
                                height: cellHeight + 'px',
                                left: daysFromStart * cellWidth + 'px',
                                top: headHeight + monthHeight + roomIndex * cellHeight + 'px'}}>
                            <div className="reservation-body">
                                <span className="new-label">{trans('NEW_RESERVATION')}</span>
                                <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.room);}} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
});

SheetNewReservation = connectToStores(SheetNewReservation, [NewReservationStore], (context, props) => ({
    roomReservations: context.getStore(NewReservationStore).getRoomReservations()
}));

module.exports = provideContext(SheetNewReservation);
