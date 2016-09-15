const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const ReservationsStore = require('core/calendar/reservationsStore');
const NewReservationStore = require('core/calendar/newReservationStore');
const DatePicker = require('react-datepicker');
import Button from 'react-bootstrap/lib/Button';
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import SheetNewReservation from 'core/calendar/sheetNewReservation';
import SheetReservations from 'core/calendar/sheetReservations';
import NewReservation from 'core/calendar/newReservation';
import DaySelector from 'core/calendar/DaySelector';
import RoomsStore from 'core/roomsStore';
import CalendarHeader from 'core/calendar/calendarHeader';
import {getDatesRange, diffDays} from 'core/utils/utils';

let Calendar = React.createClass({
    loadReservations: function() {
        this.props.context.executeAction(actions.loadReservations);
    },

    scrollCalendarToDay: function(selectedDay) {
        this.refs.calendarSheet.scrollLeft = (diffDays(this.state.dateFrom, selectedDay) - 1) * cellWidth;
    },

    componentDidMount: function() {
        this.loadReservations();
        this.scrollCalendarToDay(moment());
    },

    getInitialState: function(){
        return {
            dateFrom: moment('2016-06-01'),
            dateTo: moment('2016-12-31'),
            selectingNewReservation: false,
            selectingFromX: null
        };
    },

    setStartDate: function(date) {
        this.setState({startDate: date});
    },

    startSelectingNewReservation(e, roomId, date) {
        if (this.props.context.getStore(NewReservationStore).getRoomReservation(roomId)) return false;
        this.setState({selectingNewReservation: roomId, selectingFromX: e.clientX}, () => {
            this.props.context.getStore(NewReservationStore).selectRoom(roomId, date);
        });
        global.window.addEventListener('mousemove', this.selectNewReservation);
        global.window.addEventListener('mouseup', this.stopSelectingNewReservation);
    },

    selectNewReservation(e) {
        $('#sheet-new-reservation-' + this.state.selectingNewReservation).width(e.clientX - this.state.selectingFromX);
    },

    stopSelectingNewReservation(e) {
        let days = (e.clientX - this.state.selectingFromX) / cellWidth;
        if (days > 0.5) {
            this.props.context.getStore(NewReservationStore).setRoomReservationDays(this.state.selectingNewReservation, days);
        }
        else {
            this.props.context.getStore(NewReservationStore).deselectRoom(this.state.selectingNewReservation);
        }
        this.setState({selectingNewReservation: false, selectingFromX: null});
        global.window.removeEventListener('mousemove', this.selectNewReservation);
        global.window.removeEventListener('mouseup', this.stopSelectingNewReservation);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return !this.state.dateFrom.isSame(nextState.dateFrom, 'day') || !this.state.dateTo.isSame(nextState.dateTo, 'day');
    },

    render: function() {
        let {dateFrom, dateTo} = this.state;
        let {context, rooms} = this.props;
        let sheetDates = getDatesRange(dateFrom, dateTo);
        return (
            <div className="calendar">
                <NewReservation context={context} />
                <h1>{trans('CALENDAR')}</h1>
                <DaySelector context={context} dateFrom={dateFrom} dateTo={dateTo} scrollCalendar={this.scrollCalendarToDay}/>
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
                    <div className="room aside-cell" style={{height: headHeight + 'px'}}></div>
                </div>
                <div className="calendar-sheet-container reservation-sheet two-headers" ref="calendarSheet">
                    <div className="calendar-sheet" style={{width: _.size(sheetDates) * cellWidth + 'px'}}>
                        <CalendarHeader context={context} dates={sheetDates} position={'top'} />
                        <div className="calendar-table">
                            {_.map(rooms, (room, i) => {
                                return (
                                    <div
                                        key={'row-' + i}
                                        className="calendar-row">
                                        {_.map(sheetDates, (date, j) => {
                                            return (
                                                <div
                                                    key={'cell-' + j}
                                                    className={cx('calendar-cell', i % 2 ? 'odd' : 'even')}
                                                    style={{width: cellWidth + 'px', height: cellHeight + 'px'}}
                                                    onMouseDown={(e) => {if (e.button == 0) this.startSelectingNewReservation(e, room.id, date);}}>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <CalendarHeader context={context} dates={sheetDates} position={'bottom'} />
                        <SheetReservations context={context} dateFrom={dateFrom} dateTo={dateTo} stopSelectingNewReservation={this.stopSelectingNewReservation} />
                        <SheetNewReservation context={context} dateFrom={dateFrom} dateTo={dateTo} />
                    </div>
                </div>
            </div>
        );
    }
});

Calendar = connectToStores(Calendar, [RoomsStore], (context, props) => ({
    rooms: context.getStore(RoomsStore).getRooms()
}));

module.exports = Calendar;
