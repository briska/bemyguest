const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const ReservationsStore = require('core/calendar/reservationsStore');
const NewReservationStore = require('core/calendar/newReservationStore');
const DatePicker = require('react-bootstrap-date-picker');
import {Button} from 'react-bootstrap';
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import SheetNewReservation from 'core/calendar/sheetNewReservation';
import SheetReservations from 'core/calendar/sheetReservations';

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
    
    selectNewReservation(room, date) {
        if (this.state.selectingNewReservation == room) {
            this.props.context.getStore(NewReservationStore).selectRoom(room, date);
        }
    },
    
    startSelectingNewReservation(room, date) {
        this.setState({selectingNewReservation: room}, () => {this.selectNewReservation(room, date);});
        global.window.addEventListener('mouseup', this.stopSelectingNewReservation);
    },
    
    stopSelectingNewReservation() {
        this.setState({selectingNewReservation: false});
    },
    
    shouldComponentUpdate: function(nextProps, nextState) {
        return !this.state.dateFrom.isSame(nextState.dateFrom, 'day') || !this.state.dateTo.isSame(nextState.dateTo, 'day');
    },
    
    render: function() {
        let {startDate, dateFrom, dateTo} = this.state;
        let {context} = this.props;
        let {rooms} = context;
        let sheetDates = [];
        let sheetMonths = [];
        for (let d = moment(dateFrom); d.isSameOrBefore(dateTo); d.add(1, 'days')) {
            sheetDates.push(moment(d));
        }
        for (let d = moment(dateFrom); d.isSameOrBefore(dateTo, 'month'); d.add(1, 'months')) {
            let days;
            if (d.isSame(dateFrom, 'month')) {
                days = moment(dateFrom).endOf('month').diff(dateFrom, 'days') + 1;
            }
            else if (d.isSame(dateTo, 'month')) {
                days = dateTo.date();
            }
            else {
                days = moment(d).endOf('month').date();
            }
            sheetMonths.push({name: d.format('MMMM'), days: days});
        }
        return (
            <div className="calendar">
                <h1>{trans('CALENDAR')}</h1>
                <div className="top-selector">
                    <span>{trans('FROM')}:</span>
                    <DatePicker value={startDate.toISOString()} onChange={() => {this.setStartDate(moment(value));}} />
                    <Button onClick={() => {this.setStartDate(moment());}}>{trans('TODAY')}</Button>
                </div>
                <div className="rooms" style={{marginTop: monthHeight + 'px'}}>
                    <div className="room" style={{height: headHeight + 'px'}}></div>
                    {_.map(rooms, (room, i) => {
                        return (
                            <div
                                key={'room-' + room.id}
                                className="room"
                                style={{height: cellHeight + 'px'}}>
                                {room.name}
                            </div>
                        );
                    })}
                </div>
                <div className="calendar-sheet-container">
                    <div className="calendar-sheet" style={{width: _.size(sheetDates) * cellWidth + 'px'}}>
                        <div className="calendar-months">
                            {_.map(sheetMonths, (month, i) => {
                                return (
                                    <div
                                        key={'month-' + i}
                                        className="calendar-month"
                                        style={{height: monthHeight + 'px', width: month.days * cellWidth + 'px'}}>
                                        <span className="month-name">{month.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <table className="calendar-table" style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    {_.map(sheetDates, (date, i) => {
                                        return (
                                            <th
                                                key={'date-' + i}
                                                className={'calendar-head-cell'}
                                                style={{width: cellWidth + 'px', height: headHeight + 'px'}}>
                                                <span className="day-number">{date.format('Do')}</span>
                                                <span className="day-name">{date.format('dddd')}</span>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {_.map(rooms, (room, i) => {
                                    return (
                                        <tr
                                            key={'row-' + i}
                                            className="calendar-row">
                                            {_.map(sheetDates, (date, j) => {
                                                return (
                                                    <td
                                                        key={'cell-' + j}
                                                        className={cx('calendar-cell', i % 2 ? 'odd' : 'even')}
                                                        style={{width: cellWidth + 'px', height: cellHeight + 'px'}}
                                                        onMouseDown={() => {this.startSelectingNewReservation(room.id, date);}}
                                                        onMouseEnter={() => {this.selectNewReservation(room.id, date);}}>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <SheetReservations context={context} dateFrom={dateFrom} dateTo={dateTo} />
                        <SheetNewReservation context={context} dateFrom={dateFrom} dateTo={dateTo} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = provideContext(Calendar);
