'use strict';

var _enums = require('core/enums');

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _utils = require('core/utils/utils');

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var trans = require('core/utils/trans');
var cx = require('classnames');


var RoomReservationDetails = React.createClass({
    displayName: 'RoomReservationDetails',

    getInitialState: function getInitialState() {
        return {
            show: false
        };
    },

    open: function open() {
        this.setState({ show: true });
        global.window.addEventListener('mousedown', this.globalClose);
    },

    close: function close() {
        this.setState({ show: false });
        global.window.removeEventListener('mousedown', this.globalClose);
    },

    globalClose: function globalClose(e) {
        if (!this.props.getTarget().contains(e.target) && !ReactDOM.findDOMNode(this.refs.details).contains(e.target)) {
            this.close();
        }
    },

    toggle: function toggle() {
        this.state.show ? this.close() : this.open();
    },

    render: function render() {
        var _props = this.props;
        var context = _props.context;
        var roomReservation = _props.roomReservation;
        var reservation = _props.reservation;
        var room = _props.room;
        var getTarget = _props.getTarget;
        var show = this.state.show;

        var contact = _.filter([reservation.contactName, reservation.contactMail, reservation.contactPhone], null);
        var guests = _.map(roomReservation.guests, function (guest) {
            return _.filter([guest.namePrefix, guest.name, guest.surname, guest.nameSuffix], null).join(' ');
        });
        var roomIds = _.map(reservation.roomReservations, 'roomId');
        var rooms = _.map(context.getStore(_roomsStore2.default).getRooms(roomIds), 'name');
        var datesRange = (0, _utils.getDatesRange)(reservation.dateFrom, reservation.dateTo);
        return React.createElement(
            _reactBootstrap.Overlay,
            {
                show: show,
                target: getTarget,
                animation: false,
                placement: 'bottom' },
            React.createElement(
                'div',
                { className: 'room-reservation-details', ref: 'details' },
                React.createElement(
                    'h4',
                    { className: 'room-name' },
                    room.name
                ),
                React.createElement(
                    'p',
                    { className: 'dates' },
                    roomReservation.dateFrom.format('D. MMMM YYYY '),
                    ' - ',
                    roomReservation.dateTo.format('D. MMMM YYYY')
                ),
                !_.isEmpty(guests) && React.createElement(
                    'p',
                    { className: 'guests' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('GUESTS'),
                        ':'
                    ),
                    ' ',
                    guests.join(', ')
                ),
                React.createElement('div', { className: 'separator' }),
                React.createElement(
                    'h4',
                    { className: 'name' },
                    reservation.name || trans('RESERVATION')
                ),
                React.createElement(
                    'p',
                    { className: 'guests-count' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('GUESTS_COUNT'),
                        ':'
                    ),
                    ' ',
                    reservation.guestsCount || 0
                ),
                !_.isEmpty(rooms) && React.createElement(
                    'p',
                    { className: 'rooms' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('ROOMS'),
                        ':'
                    ),
                    ' ',
                    rooms.join(', ')
                ),
                !_.isEmpty(contact) && React.createElement(
                    'p',
                    { className: 'contact' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('CONTACT'),
                        ':'
                    ),
                    ' ',
                    contact.join(', ')
                ),
                reservation.purpose && React.createElement(
                    'p',
                    { className: 'purpose' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('PURPOSE'),
                        ':'
                    ),
                    ' ',
                    (0, _utils.substr)(reservation.purpose, 200)
                ),
                reservation.spiritualGuide && React.createElement(
                    'p',
                    { className: 'spiritual-guide' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('SPIRITUAL_GUIDE'),
                        ':'
                    ),
                    ' ',
                    reservation.spiritualGuide
                ),
                React.createElement(
                    'p',
                    { className: 'price-payed' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('PRICE_PAYED'),
                        ':'
                    ),
                    ' ',
                    reservation.pricePayed,
                    '€'
                ),
                reservation.notes && React.createElement(
                    'p',
                    { className: 'notes' },
                    React.createElement(
                        'span',
                        { className: 'caption' },
                        trans('NOTES'),
                        ':'
                    ),
                    ' ',
                    (0, _utils.substr)(reservation.notes, 200)
                ),
                !reservation.approved && React.createElement(
                    'p',
                    { className: 'approval' },
                    React.createElement(
                        'span',
                        { className: 'text-warning' },
                        trans('WAITING_FOR_APPROVAL.' + (0, _utils.approvalBy)(_.size(datesRange)))
                    )
                ),
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove', ref: 'close', onClick: this.close })
            )
        );
    }
});

module.exports = RoomReservationDetails;