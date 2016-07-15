'use strict';

var _reactBootstrap = require('react-bootstrap');

var _enums = require('core/enums');

var _sheetNewReservation = require('core/calendar/sheetNewReservation');

var _sheetNewReservation2 = _interopRequireDefault(_sheetNewReservation);

var _sheetReservations = require('core/calendar/sheetReservations');

var _sheetReservations2 = _interopRequireDefault(_sheetReservations);

var _newReservation = require('core/calendar/newReservation');

var _newReservation2 = _interopRequireDefault(_newReservation);

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var actions = require('core/actions');
var ReservationsStore = require('core/calendar/reservationsStore');
var NewReservationStore = require('core/calendar/newReservationStore');
var DatePicker = require('react-bootstrap-date-picker');


var Calendar = React.createClass({
    displayName: 'Calendar',

    loadReservations: function loadReservations() {
        this.props.context.executeAction(actions.loadReservations);
    },

    componentDidMount: function componentDidMount() {
        this.loadReservations();
    },

    getInitialState: function getInitialState() {
        return {
            startDate: moment(),
            dateFrom: moment('2016-06-01'),
            dateTo: moment('2016-12-31'),
            selectingNewReservation: false
        };
    },

    setStartDate: function setStartDate(date) {
        this.setState({ startDate: date });
    },

    selectNewReservation: function selectNewReservation(roomId, date) {
        if (this.state.selectingNewReservation == roomId) {
            this.props.context.getStore(NewReservationStore).selectRoom(roomId, date);
        }
    },
    startSelectingNewReservation: function startSelectingNewReservation(roomId, date) {
        var _this = this;

        this.setState({ selectingNewReservation: roomId }, function () {
            _this.selectNewReservation(roomId, date);
        });
        global.window.addEventListener('mouseup', this.stopSelectingNewReservation);
    },
    stopSelectingNewReservation: function stopSelectingNewReservation() {
        this.setState({ selectingNewReservation: false });
    },


    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return !this.state.dateFrom.isSame(nextState.dateFrom, 'day') || !this.state.dateTo.isSame(nextState.dateTo, 'day');
    },

    render: function render() {
        var _this2 = this;

        var _state = this.state;
        var startDate = _state.startDate;
        var dateFrom = _state.dateFrom;
        var dateTo = _state.dateTo;
        var _props = this.props;
        var context = _props.context;
        var rooms = _props.rooms;

        var sheetDates = [];
        var sheetMonths = [];
        for (var d = moment(dateFrom); d.isSameOrBefore(dateTo); d.add(1, 'days')) {
            sheetDates.push(moment(d));
        }
        for (var _d = moment(dateFrom); _d.isSameOrBefore(dateTo, 'month'); _d.add(1, 'months')) {
            var days = void 0;
            if (_d.isSame(dateFrom, 'month')) {
                days = moment(dateFrom).endOf('month').diff(dateFrom, 'days') + 1;
            } else if (_d.isSame(dateTo, 'month')) {
                days = dateTo.date();
            } else {
                days = moment(_d).endOf('month').date();
            }
            sheetMonths.push({ name: _d.format('MMMM'), days: days });
        }
        return React.createElement(
            'div',
            { className: 'calendar' },
            React.createElement(
                'h1',
                null,
                trans('CALENDAR')
            ),
            React.createElement(
                'div',
                { className: 'top-selector' },
                React.createElement(
                    'span',
                    null,
                    trans('FROM'),
                    ':'
                ),
                React.createElement(DatePicker, { value: startDate.toISOString(), onChange: function onChange() {
                        _this2.setStartDate(moment(value));
                    } }),
                React.createElement(
                    _reactBootstrap.Button,
                    { onClick: function onClick() {
                            _this2.setStartDate(moment());
                        } },
                    trans('TODAY')
                )
            ),
            React.createElement(
                'div',
                { className: 'rooms', style: { marginTop: _enums.monthHeight + 'px' } },
                React.createElement('div', { className: 'room', style: { height: _enums.headHeight + 'px' } }),
                _.map(rooms, function (room, i) {
                    return React.createElement(
                        'div',
                        {
                            key: 'room-' + room.id,
                            className: 'room',
                            style: { height: _enums.cellHeight + 'px' } },
                        room.name
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'calendar-sheet-container' },
                React.createElement(
                    'div',
                    { className: 'calendar-sheet', style: { width: _.size(sheetDates) * _enums.cellWidth + 'px' } },
                    React.createElement(
                        'div',
                        { className: 'calendar-months' },
                        _.map(sheetMonths, function (month, i) {
                            return React.createElement(
                                'div',
                                {
                                    key: 'month-' + i,
                                    className: 'calendar-month',
                                    style: { height: _enums.monthHeight + 'px', width: month.days * _enums.cellWidth + 'px' } },
                                React.createElement(
                                    'span',
                                    { className: 'month-name' },
                                    month.name
                                )
                            );
                        })
                    ),
                    React.createElement(
                        'table',
                        { className: 'calendar-table', style: { width: '100%' } },
                        React.createElement(
                            'thead',
                            null,
                            React.createElement(
                                'tr',
                                null,
                                _.map(sheetDates, function (date, i) {
                                    return React.createElement(
                                        'th',
                                        {
                                            key: 'date-' + i,
                                            className: 'calendar-head-cell',
                                            style: { width: _enums.cellWidth + 'px', height: _enums.headHeight + 'px' } },
                                        React.createElement(
                                            'span',
                                            { className: 'day-number' },
                                            date.format('Do')
                                        ),
                                        React.createElement(
                                            'span',
                                            { className: 'day-name' },
                                            date.format('dddd')
                                        )
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            'tbody',
                            null,
                            _.map(rooms, function (room, i) {
                                return React.createElement(
                                    'tr',
                                    {
                                        key: 'row-' + i,
                                        className: 'calendar-row' },
                                    _.map(sheetDates, function (date, j) {
                                        return React.createElement('td', {
                                            key: 'cell-' + j,
                                            className: cx('calendar-cell', i % 2 ? 'odd' : 'even'),
                                            style: { width: _enums.cellWidth + 'px', height: _enums.cellHeight + 'px' },
                                            onMouseDown: function onMouseDown() {
                                                _this2.startSelectingNewReservation(room.id, date);
                                            },
                                            onMouseEnter: function onMouseEnter() {
                                                _this2.selectNewReservation(room.id, date);
                                            } });
                                    })
                                );
                            })
                        )
                    ),
                    React.createElement(_sheetReservations2.default, { context: context, dateFrom: dateFrom, dateTo: dateTo }),
                    React.createElement(_sheetNewReservation2.default, { context: context, dateFrom: dateFrom, dateTo: dateTo })
                )
            ),
            React.createElement(_newReservation2.default, { context: context })
        );
    }
});

Calendar = connectToStores(Calendar, [_roomsStore2.default], function (context, props) {
    return {
        rooms: context.getStore(_roomsStore2.default).getRooms()
    };
});

module.exports = provideContext(Calendar);