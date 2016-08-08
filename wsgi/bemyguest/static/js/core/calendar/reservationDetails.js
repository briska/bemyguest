'use strict';

var _enums = require('core/enums');

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _utils = require('core/utils/utils');

var _reactBootstrap = require('react-bootstrap');

var _notes = require('core/calendar/editReservation/notes');

var _notes2 = _interopRequireDefault(_notes);

var _mailCommunication = require('core/calendar/editReservation/mailCommunication');

var _mailCommunication2 = _interopRequireDefault(_mailCommunication);

var _name = require('core/calendar/editReservation/name');

var _name2 = _interopRequireDefault(_name);

var _contact = require('core/calendar/editReservation/contact');

var _contact2 = _interopRequireDefault(_contact);

var _purpose = require('core/calendar/editReservation/purpose');

var _purpose2 = _interopRequireDefault(_purpose);

var _spiritualGuide = require('core/calendar/editReservation/spiritualGuide');

var _spiritualGuide2 = _interopRequireDefault(_spiritualGuide);

var _pricePayed = require('core/calendar/editReservation/pricePayed');

var _pricePayed2 = _interopRequireDefault(_pricePayed);

var _guestsCount = require('core/calendar/editReservation/guestsCount');

var _guestsCount2 = _interopRequireDefault(_guestsCount);

var _roomReservation = require('core/calendar/editReservation/roomReservation');

var _roomReservation2 = _interopRequireDefault(_roomReservation);

var _meals = require('core/calendar/editReservation/meals');

var _meals2 = _interopRequireDefault(_meals);

var _approval = require('core/calendar/editReservation/approval');

var _approval2 = _interopRequireDefault(_approval);

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');


var ReservationDetails = React.createClass({
    displayName: 'ReservationDetails',

    getInitialState: function getInitialState() {
        var reservation = this.props.reservation;

        return {
            show: false
        };
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return this.state.show || nextState.show;
    },

    open: function open() {
        this.setState({ show: true });
    },

    close: function close() {
        this.setState({ show: false });
    },

    remove: function remove() {
        if (!confirm(trans('CONFIRM_REMOVING_RESERVATION'))) return;
        this.close();
        var payload = {
            'id': this.props.reservation.id
        };
        this.props.context.executeAction(_actions2.default.removeReservation, payload);
    },

    render: function render() {
        var _props = this.props;
        var context = _props.context;
        var reservation = _props.reservation;
        var show = this.state.show;

        var datesRange = (0, _utils.getDatesRange)(reservation.dateFrom, reservation.dateTo);
        return React.createElement(
            _reactBootstrap.Modal,
            { dialogClassName: 'reservation-details', bsSize: 'lg', show: show, onHide: this.close },
            React.createElement(
                _reactBootstrap.Modal.Header,
                { closeButton: true },
                React.createElement(_name2.default, { context: context, reservationId: reservation.id, name: reservation.name })
            ),
            React.createElement(
                _reactBootstrap.Modal.Body,
                null,
                !reservation.approved && React.createElement(_approval2.default, { context: context, reservationId: reservation.id, days: _.size(datesRange) }),
                React.createElement(_guestsCount2.default, { context: context, reservationId: reservation.id, guestsCount: reservation.guestsCount }),
                _.map(reservation.roomReservations, function (roomReservation) {
                    return React.createElement(_roomReservation2.default, {
                        key: 'detail-room-reservation-' + roomReservation.id,
                        context: context,
                        reservationId: reservation.id,
                        roomReservation: roomReservation,
                        reservationDateFrom: reservation.dateFrom,
                        reservationDateTo: reservation.dateTo });
                }),
                React.createElement(_meals2.default, { context: context, reservationId: reservation.id, meals: reservation.meals, datesRange: datesRange }),
                React.createElement(_purpose2.default, { context: context, reservationId: reservation.id, purpose: reservation.purpose }),
                React.createElement(_spiritualGuide2.default, { context: context, reservationId: reservation.id, spiritualGuide: reservation.spiritualGuide }),
                React.createElement(_contact2.default, {
                    context: context,
                    reservationId: reservation.id,
                    contactName: reservation.contactName,
                    contactMail: reservation.contactMail,
                    contactPhone: reservation.contactPhone }),
                React.createElement(_pricePayed2.default, { context: context, reservationId: reservation.id, pricePayed: reservation.pricePayed }),
                React.createElement(_notes2.default, { context: context, reservationId: reservation.id, notes: reservation.notes }),
                React.createElement(_mailCommunication2.default, { context: context, reservationId: reservation.id, mailCommunication: reservation.mailCommunication })
            ),
            React.createElement(
                _reactBootstrap.Modal.Footer,
                null,
                React.createElement(
                    'span',
                    { className: 'edit-label' },
                    React.createElement(_reactBootstrap.Glyphicon, { glyph: 'pencil' }),
                    ' ',
                    trans('USE_DOUBLECLICK_TO_EDIT')
                ),
                React.createElement(
                    _reactBootstrap.Button,
                    { onClick: this.remove, bsStyle: 'danger' },
                    trans('REMOVE')
                ),
                React.createElement(
                    _reactBootstrap.Button,
                    { onClick: this.close },
                    trans('CLOSE')
                )
            )
        );
    }
});

module.exports = ReservationDetails;