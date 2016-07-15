'use strict';

var _enums = require('core/enums');

var _reactBootstrap = require('react-bootstrap');

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _createReservation = require('core/calendar/createReservation');

var _createReservation2 = _interopRequireDefault(_createReservation);

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


var NewReservation = React.createClass({
    displayName: 'NewReservation',

    deselectRoom: function deselectRoom(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    createReservation: function createReservation() {
        this.refs.createReservation.refs.wrappedElement.open();
    },

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var dateFrom = _props.dateFrom;
        var dateTo = _props.dateTo;
        var roomReservations = _props.roomReservations;

        if (_.isEmpty(roomReservations)) return null;
        var fullCapacity = 0;
        var roomReservationsToRender = _.map(roomReservations, function (roomReservation, i) {
            var reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
            var room = context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId);
            fullCapacity += room.capacity;
            return React.createElement(
                'div',
                {
                    key: 'new-reservation-' + i,
                    className: 'new-reservation-room' },
                React.createElement(
                    'h4',
                    null,
                    React.createElement(
                        'span',
                        { className: 'room-name' },
                        room.name
                    ),
                    ' ',
                    React.createElement(
                        'span',
                        { className: 'house-name' },
                        '(',
                        room.house.name,
                        ')'
                    )
                ),
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove', onClick: function onClick() {
                        _this.deselectRoom(roomReservation.room.id);
                    } }),
                React.createElement(
                    'p',
                    { className: 'capacity' },
                    trans('CAPACITY', { count: room.capacity })
                ),
                React.createElement(
                    'p',
                    { className: 'date' },
                    roomReservation.dateFrom.format('D. MMMM YYYY'),
                    ' - ',
                    roomReservation.dateTo.format('D. MMMM YYYY')
                )
            );
        });
        return React.createElement(
            'div',
            { className: 'new-reservation' },
            React.createElement(
                'h2',
                { className: 'new-label' },
                trans('NEW_RESERVATION')
            ),
            React.createElement(
                'p',
                { className: 'full-capacity' },
                trans('FULL_CAPACITY', { count: fullCapacity })
            ),
            roomReservationsToRender,
            React.createElement(
                _reactBootstrap.Button,
                { bsStyle: 'primary', onClick: this.createReservation },
                trans('CREATE_RESERVATION')
            ),
            React.createElement(_createReservation2.default, { ref: 'createReservation', context: context, roomReservations: roomReservations })
        );
    }
});

NewReservation = connectToStores(NewReservation, [NewReservationStore], function (context, props) {
    return {
        roomReservations: context.getStore(NewReservationStore).getRoomReservations()
    };
});

module.exports = provideContext(NewReservation);