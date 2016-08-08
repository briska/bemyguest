'use strict';

var _sheetReservation = require('core/calendar/sheetReservation');

var _sheetReservation2 = _interopRequireDefault(_sheetReservation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
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

        return React.createElement(
            'div',
            { className: 'sheet-reservations' },
            _.map(reservations, function (reservation, i) {
                return React.createElement(_sheetReservation2.default, {
                    key: 'reservation-' + reservation.id,
                    context: context,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    reservation: reservation });
            })
        );
    }
});

SheetReservations = connectToStores(SheetReservations, [ReservationsStore], function (context, props) {
    return {
        reservations: context.getStore(ReservationsStore).getReservations()
    };
});

module.exports = SheetReservations;