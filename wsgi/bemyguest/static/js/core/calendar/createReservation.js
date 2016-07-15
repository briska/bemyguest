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


var CreateReservation = React.createClass({
    displayName: 'CreateReservation',

    getInitialState: function getInitialState() {
        return { show: false };
    },

    deselectRoom: function deselectRoom(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    open: function open() {
        this.setState({ show: true });
    },

    close: function close() {
        this.setState({ show: false });
    },

    render: function render() {
        var _this = this;

        var _props = this.props;
        var context = _props.context;
        var roomReservations = _props.roomReservations;
        var _state = this.state;
        var reservationName = _state.reservationName;
        var guestsCount = _state.guestsCount;
        var contactName = _state.contactName;
        var contactMail = _state.contactMail;
        var contactPhone = _state.contactPhone;

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
            _reactBootstrap.Modal,
            { dialogClassName: 'create-reservation', show: this.state.show },
            React.createElement(
                _reactBootstrap.Modal.Header,
                { closeButton: true, onHide: this.close },
                React.createElement(
                    'h2',
                    { className: 'new-label' },
                    trans('NEW_RESERVATION')
                )
            ),
            React.createElement(
                _reactBootstrap.Modal.Body,
                null,
                React.createElement(
                    _reactBootstrap.FormGroup,
                    { controlId: 'reservation-name' },
                    React.createElement(
                        _reactBootstrap.ControlLabel,
                        null,
                        trans('RESERVATION_NAME')
                    ),
                    React.createElement(_reactBootstrap.FormControl, { type: 'text', value: reservationName, onChange: function onChange() {
                            _this.handleChange('reservationName');
                        } })
                ),
                React.createElement(
                    _reactBootstrap.FormGroup,
                    { controlId: 'guests-count' },
                    React.createElement(
                        _reactBootstrap.ControlLabel,
                        null,
                        trans('GUESTS_COUNT')
                    ),
                    React.createElement(_reactBootstrap.FormControl, { type: 'number', value: guestsCount, onChange: function onChange() {
                            _this.handleChange('guestsCount');
                        } })
                ),
                roomReservationsToRender,
                React.createElement(
                    'h4',
                    null,
                    trans('CONTACT')
                ),
                React.createElement(
                    _reactBootstrap.FormGroup,
                    { controlId: 'contact-name' },
                    React.createElement(
                        _reactBootstrap.ControlLabel,
                        null,
                        trans('CONTACT_NAME')
                    ),
                    React.createElement(_reactBootstrap.FormControl, { type: 'text', value: contactName, onChange: function onChange() {
                            _this.handleChange('contactName');
                        } })
                ),
                React.createElement(
                    _reactBootstrap.FormGroup,
                    { controlId: 'contact-mail' },
                    React.createElement(
                        _reactBootstrap.ControlLabel,
                        null,
                        trans('CONTACT_MAIL')
                    ),
                    React.createElement(_reactBootstrap.FormControl, { type: 'email', value: contactMail, onChange: function onChange() {
                            _this.handleChange('contactMail');
                        } })
                ),
                React.createElement(
                    _reactBootstrap.FormGroup,
                    { controlId: 'contact-phone' },
                    React.createElement(
                        _reactBootstrap.ControlLabel,
                        null,
                        trans('CONTACT_PHONE')
                    ),
                    React.createElement(_reactBootstrap.FormControl, { type: 'text', value: contactPhone, onChange: function onChange() {
                            _this.handleChange('contactPhone');
                        } })
                ),
                React.createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'primary' },
                    trans('SAVE_RESERVATION')
                )
            ),
            React.createElement(
                _reactBootstrap.Modal.Footer,
                null,
                React.createElement(
                    _reactBootstrap.Button,
                    { onClick: this.close },
                    'Close'
                )
            )
        );
    }
});

module.exports = provideContext(CreateReservation);