const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const NewReservationStore = require('core/calendar/newReservationStore');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import RoomsStore from 'core/roomsStore';
import {diffDays} from 'core/utils/utils';

let SheetNewReservation = React.createClass({
    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },
    
    render: function() {
        let {context, dateFrom, dateTo, roomReservations} = this.props;
        return (
            <div className="sheet-new-reservation">
                {_.map(roomReservations, (roomReservation, i) => {
                    let roomReservationDays = diffDays(roomReservation.dateFrom, roomReservation.dateTo);
                    if (roomReservationDays <= 1) return null;
                    let daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                    let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId);
                    return (
                        <div
                            key={'sheet-new-reservation-' + i}
                            className={cx('room-reservation', 'reservation-new')}
                            style={{
                                width: (roomReservationDays - 1) * cellWidth + 'px',
                                height: cellHeight + 'px',
                                left: (daysFromStart + 0.5) * cellWidth + 'px',
                                top: headHeight + monthHeight + roomIndex * cellHeight + 'px'}}>
                            <div className="reservation-body">
                                <span>{trans('NEW_RESERVATION')}</span>
                                <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.roomId);}} />
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

module.exports = SheetNewReservation;
