'use strict';

var _enums = require('core/enums');

var _reactBootstrap = require('react-bootstrap');

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
var NewReservationStore = require('core/calendar/newReservationStore');


var SheetNewReservation = React.createClass({
    displayName: 'SheetNewReservation',

    deselectRoom: function deselectRoom(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var roomReservations = _props.roomReservations;

        return React.createElement(
            'div',
            { className: 'sheet-new-reservation' },
            _.map(roomReservations, function (roomReservation, i) {
                var daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                var reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
                var roomIndex = context.getStore(_roomsStore2.default).getRoomIndex(roomReservation.roomId);
                return React.createElement(
                    'div',
                    {
                        key: 'sheet-new-reservation-' + i,
                        className: cx('calendar-reservation', 'reservation-new'),
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
                            { className: 'new-label' },
                            trans('NEW_RESERVATION')
                        ),
                        React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove', onClick: function onClick() {
                                _this.deselectRoom(roomReservation.roomId);
                            } })
                    )
                );
            })
        );
    }
});

SheetNewReservation = connectToStores(SheetNewReservation, [NewReservationStore], function (context, props) {
    return {
        roomReservations: context.getStore(NewReservationStore).getRoomReservations()
    };
});

module.exports = provideContext(SheetNewReservation);