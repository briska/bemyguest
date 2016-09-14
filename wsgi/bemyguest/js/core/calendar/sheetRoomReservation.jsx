const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import {diffDays} from 'core/utils/utils';
import RoomsStore from 'core/roomsStore';
import RoomReservationDetails from 'core/calendar/roomReservationDetails';

let SheetRoomReservation = React.createClass({
    render: function() {
        let {context, dateFrom, dateTo, reservation, roomReservation, getReservationDetails} = this.props;
        let roomReservationDays = diffDays(roomReservation.dateFrom, roomReservation.dateTo);
        if (roomReservationDays <= 1) return null;
        let room = context.getStore(RoomsStore).getRoom(roomReservation.roomId);
        let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId);
        return (
            <div
                className="room-reservation"
                style={{
                    width: (roomReservationDays - 1) * cellWidth + 'px',
                    height: cellHeight + 'px',
                    left: (diffDays(dateFrom, roomReservation.dateFrom) - 0.5) * cellWidth + 'px',
                    top: headHeight + monthHeight + roomIndex * cellHeight + 'px',
                    background: reservation.color}}
                onClick={() => {this.refs.roomReservationDetails.toggle();}}
                onDoubleClick={(e) => {this.refs.roomReservationDetails.close(); getReservationDetails().open();}}>
                <div className="reservation-body">
                    <span>{reservation.name ? reservation.name : reservation.contactName}</span>
                </div>
                <RoomReservationDetails
                    ref="roomReservationDetails"
                    context={context}
                    roomReservation={roomReservation}
                    reservation={reservation}
                    room={room}
                    getTarget={() => ReactDOM.findDOMNode(this)} />
            </div>
        );
    }
});

module.exports = SheetRoomReservation;
