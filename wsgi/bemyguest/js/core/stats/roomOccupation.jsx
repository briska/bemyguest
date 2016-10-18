const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const connectToStores = require('fluxible-addons-react/connectToStores');
const ReservationsStore = require('core/calendar/reservationsStore');
import RoomsStore from 'core/roomsStore';
const moment = require('moment');
require('moment/locale/sk');
import {getDatesRange, diffDays} from 'core/utils/utils';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import {cellWidth, cellHeight, headHeight, monthHeight, DAY_FORMAT} from 'core/enums';
import CalendarHeader from 'core/calendar/calendarHeader';
const cx = require('classnames');

let RoomOccupation = React.createClass({
    getInitialState: function(){
        return {
            currentWeekFrom: moment().startOf('isoWeek'),
            currentWeekTo: moment().endOf('isoWeek')
        };
    },

    getWeekRooms: function() {
        let reservations = this.props.reservations;
        let roomReservationSubset = [];
        _.map(reservations, (reservation, i) => {
            if (this.isInDateRange(reservation.dateFrom, reservation.dateTo)) {
                _.map(reservation.roomReservations, (roomReservation) => {
                    if (this.isInDateRange(roomReservation.dateFrom, roomReservation.dateTo)) {
                        let room = {};
                        room.reservationId = reservation.id;
                        room.roomReservationId = roomReservation.id;
                        room.roomId = roomReservation.roomId;
                        room.dateFrom = roomReservation.dateFrom;
                        room.dateTo = roomReservation.dateTo;
                        room.color = reservation.color;
                        roomReservationSubset.push(room);
                    }
                });
            }
        });
        return roomReservationSubset;
    },

    isInDateRange: function(itemDateFrom, itemDateTo) {
        let {currentWeekFrom, currentWeekTo} = this.state;
        return ((itemDateFrom.isSameOrAfter(currentWeekFrom) && itemDateFrom.isSameOrBefore(currentWeekTo)) ||
                (itemDateTo.isSameOrAfter(currentWeekFrom) && itemDateTo.isSameOrBefore(currentWeekTo)) ||
                (itemDateFrom.isBefore(currentWeekFrom) && itemDateTo.isSameOrAfter(currentWeekTo)));
    },

    setActualWeek: function() {
        this.setState({currentWeekFrom: moment().startOf('isoWeek'), currentWeekTo: moment().endOf('isoWeek')});
    },

    handleWeek: function(moveToNext) {
        if (moveToNext) {
            this.setState({currentWeekFrom: this.state.currentWeekFrom.add(1, 'week'), currentWeekTo: this.state.currentWeekTo.add(1, 'week')});
        } else {
            this.setState({currentWeekFrom: this.state.currentWeekFrom.subtract(1, 'week'), currentWeekTo: this.state.currentWeekTo.subtract(1, 'week')});
        }
    },

    render: function() {
        let {rooms} = this.props;
        let {currentWeekFrom, currentWeekTo} = this.state;
        let datesRange = getDatesRange(this.state.currentWeekFrom, this.state.currentWeekTo);
        let roomReservationSubset = this.getWeekRooms();
        return (
            <div className="room-occupation stats-section">
                <h2>{trans('ROOM_OCCUPATION')}</h2>
                <div className="week-selector">
                    <Button onClick={() => {this.setActualWeek();}} bsSize="small">
                        {trans('ACTUAL_WEEK')}
                    </Button>
                    <Button onClick={() => {this.handleWeek(false);}} bsSize="small">
                        <Glyphicon glyph='chevron-left'/>
                    </Button>
                    <Button onClick={() => {this.handleWeek(true);}} bsSize="small">
                        <Glyphicon glyph='chevron-right'/>
                    </Button>
                    {false && <a href={'/pdf/occupation/?date_from=' + currentWeekFrom.format(DAY_FORMAT) + '&date_to=' + currentWeekTo.format(DAY_FORMAT)} className="btn btn-primary btn-sm"
                            target="_blank">
                        <Glyphicon glyph='download-alt'/> {trans('PDF')}
                    </a>}
                </div>
                <div className="rooms calendar-aside two-headers" style={{marginTop: monthHeight + 'px'}}>
                    <div className="room aside-cell" style={{height: headHeight + 'px'}}></div>
                    {_.map(rooms, (room, i) => {
                        return (
                            <div
                                key={'room-' + room.id}
                                className="room aside-cell"
                                style={{height: cellHeight + 'px'}}>
                                {room.name}
                            </div>
                        );
                    })}
                </div>
                <div className="calendar-sheet-container">
                    <div className="calendar-sheet" style={{width: _.size(datesRange) * cellWidth + 'px'}}>
                        <CalendarHeader context={context} dates={datesRange} cellWidth={cellWidth} />
                        <div className="calendar-table">
                            {_.map(rooms, (room, i) => {
                                return (
                                    <div
                                        key={'row-' + i}
                                        className="calendar-row">
                                        {_.map(datesRange, (date, j) => {
                                            return (
                                                <div
                                                    key={'cell-' + j}
                                                    className={cx('calendar-cell', i % 2 ? 'odd' : 'even')}
                                                    style={{width: cellWidth + 'px', height: cellHeight + 'px'}}>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='sheet-reservations'>
                            {_.map(roomReservationSubset, (roomReservation, i) => {
                                let isBeforeStartDay = roomReservation.dateFrom.isBefore(currentWeekFrom);
                                let isAfterEndDay = roomReservation.dateTo.isAfter(currentWeekTo)
                                let dateFromCorrection = isBeforeStartDay ? moment(currentWeekFrom) : roomReservation.dateFrom;
                                let dateToCorrection = isAfterEndDay ? moment(currentWeekTo) : roomReservation.dateTo;
                                let roomReservationDays = diffDays(dateFromCorrection, dateToCorrection);
                                let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId);
                                let isOneDay = roomReservationDays - 1 == 0;
                                let leftOffset = isBeforeStartDay ? 0 : diffDays(currentWeekFrom, dateFromCorrection) - 0.5;
                                let widthCorrection = roomReservationDays - 1;
                                if (isOneDay) {
                                    widthCorrection = 0.5;
                                } else if (isBeforeStartDay) {
                                    widthCorrection += 0.5;
                                }
                                return (
                                    <div
                                        key={'room-reservation-' + roomReservation.reservationId + '-' + roomReservation.roomReservationId}
                                        className="room-reservation"
                                        style={{
                                            width: widthCorrection * cellWidth + 'px',
                                            height: cellHeight + 'px',
                                            left: leftOffset * cellWidth + 'px',
                                            top: headHeight + monthHeight + roomIndex * cellHeight + 'px',
                                            background: roomReservation.color}}>
                                        <div className="reservation-body" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

RoomOccupation = connectToStores(RoomOccupation, [ReservationsStore, RoomsStore], (context, props) => ({
    reservations: context.getStore(ReservationsStore).getReservations(),
    rooms: context.getStore(RoomsStore).getRooms()
}));

module.exports = RoomOccupation;
