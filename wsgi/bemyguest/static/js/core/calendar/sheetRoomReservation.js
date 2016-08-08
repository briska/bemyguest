'use strict';

var _enums = require('core/enums');

var _utils = require('core/utils/utils');

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _roomReservationDetails = require('core/calendar/roomReservationDetails');

var _roomReservationDetails2 = _interopRequireDefault(_roomReservationDetails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');


var SheetRoomReservation = React.createClass({
    displayName: 'SheetRoomReservation',

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var reservation = _props.reservation;
        var roomReservation = _props.roomReservation;
        var getReservationDetails = _props.getReservationDetails;

        var roomReservationDays = (0, _utils.diffDays)(roomReservation.dateFrom, roomReservation.dateTo);
        if (roomReservationDays <= 1) return null;
        var daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
        var room = context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId);
        var roomIndex = context.getStore(_roomsStore2.default).getRoomIndex(roomReservation.roomId);
        return React.createElement(
            'div',
            {
                className: 'room-reservation',
                style: {
                    width: (roomReservationDays - 1) * _enums.cellWidth + 'px',
                    height: _enums.cellHeight + 'px',
                    left: (daysFromStart + 0.5) * _enums.cellWidth + 'px',
                    top: _enums.headHeight + _enums.monthHeight + roomIndex * _enums.cellHeight + 'px',
                    background: reservation.color },
                onClick: function onClick() {
                    _this.refs.roomReservationDetails.toggle();
                },
                onDoubleClick: function onDoubleClick(e) {
                    _this.refs.roomReservationDetails.close();getReservationDetails().open();
                } },
            React.createElement(
                'div',
                { className: 'reservation-body' },
                React.createElement(
                    'span',
                    null,
                    reservation.name ? reservation.name : reservation.contactName
                )
            ),
            React.createElement(_roomReservationDetails2.default, {
                ref: 'roomReservationDetails',
                context: context,
                roomReservation: roomReservation,
                reservation: reservation,
                room: room,
                getTarget: function getTarget() {
                    return ReactDOM.findDOMNode(_this);
                } })
        );
    }
});

module.exports = SheetRoomReservation;