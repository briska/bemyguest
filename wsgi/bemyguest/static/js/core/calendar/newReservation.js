'use strict';

var _reactBootstrap = require('react-bootstrap');

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _createReservation = require('core/calendar/createReservation');

var _createReservation2 = _interopRequireDefault(_createReservation);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
var connectToStores = require('fluxible-addons-react/connectToStores');
var NewReservationStore = require('core/calendar/newReservationStore');


var NewReservation = React.createClass({
    displayName: 'NewReservation',

    deselectRoom: function deselectRoom(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    createReservation: function createReservation() {
        this.refs.createReservation.open();
    },

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var roomReservations = _props.roomReservations;

        if (_.isEmpty(roomReservations) || _.isEmpty(_.filter(roomReservations, function (roomReservation) {
            return !roomReservation.dateFrom.isSame(roomReservation.dateTo, 'day');
        }))) return null;
        var capacity = 0;
        var reservationDateFrom = roomReservations[0].dateFrom;
        var reservationDateTo = roomReservations[0].dateTo;
        var roomReservationsToRender = _.map(roomReservations, function (roomReservation, i) {
            if (roomReservation.dateFrom.isSame(roomReservation.dateTo, 'day')) return null;
            var room = context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId);
            capacity += room.capacity;
            if (roomReservation.dateFrom.isBefore(reservationDateFrom)) {
                reservationDateFrom = roomReservation.dateFrom;
            }
            if (roomReservation.dateTo.isAfter(reservationDateTo)) {
                reservationDateTo = roomReservation.dateTo;
            }
            return React.createElement(
                'div',
                {
                    key: 'new-reservation-' + i,
                    className: 'new-reservation-room' },
                React.createElement(
                    'p',
                    { className: 'room-name' },
                    room.name
                ),
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove', onClick: function onClick() {
                        _this.deselectRoom(roomReservation.roomId);
                    } }),
                React.createElement(
                    'p',
                    { className: 'house-name-capacity' },
                    room.house.name,
                    ', ',
                    trans('CAPACITY', { count: room.capacity })
                ),
                React.createElement(
                    'p',
                    { className: 'date-from' },
                    trans('FROM'),
                    ': ',
                    roomReservation.dateFrom.format('D. MMMM YYYY')
                ),
                React.createElement(
                    'p',
                    { className: 'date-to' },
                    trans('TO'),
                    ': ',
                    roomReservation.dateTo.format('D. MMMM YYYY')
                )
            );
        });
        return React.createElement(
            'div',
            { className: 'new-reservation' },
            React.createElement(
                'h3',
                { className: 'new-label' },
                trans('NEW_RESERVATION')
            ),
            React.createElement(
                'p',
                { className: 'capacity' },
                trans('CAPACITY', { count: capacity })
            ),
            roomReservationsToRender,
            React.createElement(
                _reactBootstrap.Button,
                { bsStyle: 'primary', onClick: this.createReservation },
                trans('CREATE_RESERVATION')
            ),
            React.createElement(_createReservation2.default, {
                ref: 'createReservation',
                context: context,
                roomReservations: roomReservations,
                capacity: capacity,
                datesRange: (0, _utils.getDatesRange)(reservationDateFrom, reservationDateTo) })
        );
    }
});

NewReservation = connectToStores(NewReservation, [NewReservationStore], function (context, props) {
    return {
        roomReservations: context.getStore(NewReservationStore).getRoomReservations()
    };
});

module.exports = NewReservation;