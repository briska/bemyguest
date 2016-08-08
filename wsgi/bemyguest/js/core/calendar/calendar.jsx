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
import {Button} from 'react-bootstrap';
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import SheetNewReservation from 'core/calendar/sheetNewReservation';
import SheetReservations from 'core/calendar/sheetReservations';
import NewReservation from 'core/calendar/newReservation';
import RoomsStore from 'core/roomsStore';
import CalendarHeader from 'core/calendar/calendarHeader';
import {getDatesRange} from 'core/utils/utils';

let Calendar = React.createClass({
    loadReservations: function() {
        this.props.context.executeAction(actions.loadReservations);
    },
    
    componentDidMount: function() {
        this.loadReservations();
    },
    
    getInitialState: function(){
        return {
            startDate: moment(),
            dateFrom: moment('2016-06-01'),
            dateTo: moment('2016-12-31'),
            selectingNewReservation: false
        };
    },
    
    setStartDate: function(date) {
        this.setState({startDate: date});
    },
    
    selectNewReservation(roomId, date) {
        if (this.state.selectingNewReservation == roomId) {
            this.props.context.getStore(NewReservationStore).selectRoom(roomId, date);
        }
    },
    
    startSelectingNewReservation(roomId, date) {
        this.setState({selectingNewReservation: roomId}, () => {
            this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
            this.props.context.getStore(NewReservationStore).selectRoom(roomId, date);
        });
        global.window.addEventListener('mouseup', this.stopSelectingNewReservation);
    },
    
    stopSelectingNewReservation() {
        if (this.props.context.getStore(NewReservationStore).getRoomReservationDays(this.state.selectingNewReservation) <= 1) {
            this.props.context.getStore(NewReservationStore).deselectRoom(this.state.selectingNewReservation);
        }
        this.setState({selectingNewReservation: false});
        global.window.removeEventListener('mouseup', this.stopSelectingNewReservation);
    },
    
    shouldComponentUpdate: function(nextProps, nextState) {
        return !this.state.dateFrom.isSame(nextState.dateFrom, 'day') || !this.state.dateTo.isSame(nextState.dateTo, 'day');
    },
    
    render: function() {
        let {startDate, dateFrom, dateTo} = this.state;
        let {context, rooms} = this.props;
        let sheetDates = getDatesRange(dateFrom, dateTo);
        return (
            <div className="calendar">
                <NewReservation context={context} />
                <h1>{trans('CALENDAR')}</h1>
                {false && <div className="top-selector">
                    <span>{trans('FROM')}:</span>
                    <DatePicker value={startDate.toISOString()} onChange={() => {this.setStartDate(moment(value));}} />
                    <Button onClick={() => {this.setStartDate(moment());}}>{trans('TODAY')}</Button>
                </div>}
                <div className="rooms calendar-aside" style={{marginTop: monthHeight + 'px'}}>
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
                <div className="calendar-sheet-container reservation-sheet">
                    <div className="calendar-sheet" style={{width: _.size(sheetDates) * cellWidth + 'px'}}>
                        <CalendarHeader context={context} dates={sheetDates} />
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
                                                    onMouseDown={(e) => {if (e.button == 0) this.startSelectingNewReservation(room.id, date);}}
                                                    onMouseEnter={() => {this.selectNewReservation(room.id, date);}}>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
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
