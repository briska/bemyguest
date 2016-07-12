'use strict';

var _enums = require('core/enums');

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var ReservationsStore = require('core/calendar/reservationsStore');


var SheetReservations = React.createClass({
    displayName: 'SheetReservations',

    render: function render() {
        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var reservations = _props.reservations;
        var rooms = context.rooms;

        return React.createElement(
            'div',
            { className: 'sheet-reservations' },
            _.map(reservations, function (reservation, i) {
                return _.map(reservation.roomReservations, function (roomReservation) {
                    var daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                    var reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
                    var roomIndex = _.findIndex(rooms, { 'id': roomReservation.room });
                    return React.createElement(
                        'div',
                        {
                            key: 'reservation-' + roomReservation.id + '-' + reservation.id,
                            className: cx('calendar-reservation', 'reservation-' + (i + 1)),
                            style: {
                                width: reservationDays * _enums.cellWidth + 'px',
                                height: _enums.cellHeight + 'px',
                                left: daysFromStart * _enums.cellWidth + 'px',
                                top: _enums.headHeight + _enums.monthHeight + roomIndex * _enums.cellHeight + 'px' } },
                        React.createElement(
                            'div',
                            { className: 'reservation-body' },
                            React.createElement(
                                'span',
                                { className: 'contact-name' },
                                reservation.contactName
                            ),
                            React.createElement(
                                'span',
                                { className: 'contact-mail' },
                                reservation.contactMail
                            ),
                            React.createElement(
                                'span',
                                { className: 'contact-phone' },
                                reservation.contactPhone
                            )
                        )
                    );
                });
            })
        );
    }
});

SheetReservations = connectToStores(SheetReservations, [ReservationsStore], function (context, props) {
    return {
        reservations: context.getStore(ReservationsStore).getReservations()
    };
});

module.exports = provideContext(SheetReservations);