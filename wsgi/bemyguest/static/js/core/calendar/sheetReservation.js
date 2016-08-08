'use strict';

var _sheetRoomReservation = require('core/calendar/sheetRoomReservation');

var _sheetRoomReservation2 = _interopRequireDefault(_sheetRoomReservation);

var _ReservationDetails = require('core/calendar/ReservationDetails');

var _ReservationDetails2 = _interopRequireDefault(_ReservationDetails);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');


var SheetReservation = React.createClass({
    displayName: 'SheetReservation',

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var reservation = _props.reservation;

        var datesRange = (0, _utils.getDatesRange)(reservation.dateFrom, reservation.dateTo);
        return React.createElement(
            'div',
            { className: 'sheet-reservation' },
            React.createElement(_ReservationDetails2.default, {
                ref: 'reservationDetails',
                context: context,
                reservation: reservation }),
            _.map(reservation.roomReservations, function (roomReservation) {
                return React.createElement(_sheetRoomReservation2.default, {
                    key: 'room-reservation-' + roomReservation.id + '-' + reservation.id,
                    context: context,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    reservation: reservation,
                    roomReservation: roomReservation,
                    getReservationDetails: function getReservationDetails() {
                        return _this.refs.reservationDetails;
                    } });
            })
        );
    }
});

module.exports = SheetReservation;