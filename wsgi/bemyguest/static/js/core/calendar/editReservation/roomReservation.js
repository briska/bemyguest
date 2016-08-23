'use strict';

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _reactNl2br = require('react-nl2br');

var _reactNl2br2 = _interopRequireDefault(_reactNl2br);

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _reactDatepicker = require('react-datepicker');

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _guest = require('core/calendar/editReservation/guest');

var _guest2 = _interopRequireDefault(_guest);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');

var moment = require('moment');
require('moment/locale/sk');


var RoomReservation = React.createClass({
    displayName: 'RoomReservation',

    getInitialState: function getInitialState() {
        var roomReservation = this.props.roomReservation;
        return {
            edit: false,
            saving: false,
            room: context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId),
            dateFrom: roomReservation.dateFrom,
            dateTo: roomReservation.dateTo
        };
    },

    handleRoom: function handleRoom(e) {
        this.setState({ room: context.getStore(_roomsStore2.default).getRoom(parseInt(e.target.value)) });
    },

    handleDate: function handleDate(key, date) {
        this.setState(_defineProperty({}, key, date));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, roomReservation: this.props.roomReservation });
    },

    remove: function remove() {
        if (!confirm(trans('CONFIRM_REMOVING_ROOM_RESERVATION'))) return;
        this.setState({ saving: true });
        var payload = {
            id: this.props.reservationId,
            data: {
                roomReservationRemove: this.props.roomReservation.id
            }
        };
        this.props.context.executeAction(_actions2.default.editReservation, payload);
    },

    save: function save() {
        this.setState({ saving: true });
        var guests = [];
        for (var index = 0; index < this.state.room.capacity; index++) {
            var guest = this.refs['guest' + index].getGuest();
            if (guest) {
                guests.push(guest);
            }
        }
        var _state = this.state;
        var room = _state.room;
        var dateFrom = _state.dateFrom;
        var dateTo = _state.dateTo;
        var _props = this.props;
        var reservationId = _props.reservationId;
        var reservationDateFrom = _props.reservationDateFrom;
        var reservationDateTo = _props.reservationDateTo;
        var roomReservation = _props.roomReservation;

        var payload = {
            id: reservationId,
            data: {
                roomReservation: {
                    id: roomReservation.id,
                    roomId: room.id,
                    dateFrom: moment(dateFrom).hour(14),
                    dateTo: moment(dateTo).hour(10),
                    guests: guests
                }
            }
        };
        if (dateFrom.isBefore(reservationDateFrom, 'day') || dateTo.isAfter(reservationDateTo, 'day')) {
            var from = dateFrom.isBefore(reservationDateFrom, 'day') ? dateFrom : reservationDateFrom;
            var to = dateTo.isAfter(reservationDateTo, 'day') ? dateTo : reservationDateTo;
            var days = (0, _utils.diffDays)(from, to);
            payload.data.prices = {
                priceHousing: (0, _utils.getHousingPrice)(days),
                priceSpiritual: (0, _utils.getSpiritualPrice)(days)
            };
        }
        this.props.context.executeAction(_actions2.default.editReservation, payload);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.saving) {
            this.setState({ saving: false, edit: false });
        }
    },

    render: function render() {
        var _this = this;

        var _state2 = this.state;
        var edit = _state2.edit;
        var saving = _state2.saving;
        var room = _state2.room;
        var dateFrom = _state2.dateFrom;
        var dateTo = _state2.dateTo;

        var guests = this.props.roomReservation.guests;
        if (edit) {
            return React.createElement(
                'div',
                { className: 'room-reservation form-group' },
                React.createElement(
                    'select',
                    { onChange: this.handleRoom, value: room.id },
                    _.map(context.getStore(_roomsStore2.default).getHouses(), function (selectHouse) {
                        return React.createElement(
                            'optgroup',
                            { label: selectHouse.name, key: 'select-house-' + selectHouse.id },
                            _.map(context.getStore(_roomsStore2.default).getRooms(selectHouse.roomIds), function (selectRoom) {
                                return React.createElement(
                                    'option',
                                    { value: selectRoom.id, key: 'select-room-' + selectRoom.id },
                                    selectRoom.name
                                );
                            })
                        );
                    })
                ),
                !saving && React.createElement(
                    _Button2.default,
                    { className: 'form-group-button cancel', onClick: this.cancel },
                    React.createElement(_Glyphicon2.default, { glyph: 'remove' })
                ),
                !saving && React.createElement(
                    _Button2.default,
                    { bsStyle: 'success', className: 'form-group-button save', onClick: this.save },
                    React.createElement(_Glyphicon2.default, { glyph: 'ok' })
                ),
                !saving && React.createElement(
                    _Button2.default,
                    { bsStyle: 'danger', className: 'form-group-button remove', onClick: this.remove },
                    React.createElement(_Glyphicon2.default, { glyph: 'trash' })
                ),
                React.createElement(
                    'div',
                    { className: 'date' },
                    React.createElement(_reactDatepicker2.default, {
                        dateFormat: 'DD. MM. YYYY',
                        selected: dateFrom,
                        maxDate: moment(dateTo).subtract(1, 'days'),
                        onChange: function onChange(date) {
                            _this.handleDate('dateFrom', date);
                        } }),
                    React.createElement(
                        'span',
                        null,
                        ' - '
                    ),
                    React.createElement(_reactDatepicker2.default, {
                        dateFormat: 'DD. MM. YYYY',
                        selected: dateTo,
                        minDate: moment(dateFrom).add(1, 'days'),
                        onChange: function onChange(date) {
                            _this.handleDate('dateTo', date);
                        } })
                ),
                React.createElement(
                    'div',
                    { className: 'guests' },
                    _.map(_.range(room.capacity), function (index) {
                        return React.createElement(_guest2.default, {
                            key: 'detail-guest-' + index,
                            ref: 'guest' + index,
                            context: _this.props.context,
                            guest: guests[index] });
                    })
                )
            );
        }
        return React.createElement(
            'div',
            { className: 'room-reservation form-group', onDoubleClick: this.startEditing },
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
            React.createElement(
                'div',
                { className: 'date' },
                dateFrom.format('D. MMMM YYYY'),
                ' - ',
                dateTo.format('D. MMMM YYYY')
            ),
            _.map(guests, function (guest) {
                var guestName = _.filter([guest.namePrefix, guest.name, guest.surname, guest.nameSuffix], null).join(' ');
                var guestAddress = _.filter([guest.addressStreet, guest.addressNumber, guest.addressCity], null).join(' ');
                var guestDetails = guestAddress ? guest.phone ? guestAddress + ', ' + guest.phone : guestAddress : guest.phone;
                return React.createElement(
                    'div',
                    { key: 'detail-guest-' + guest.id, className: 'detail-guest' },
                    guestName + (guestDetails ? ' (' + guestDetails + ')' : '')
                );
            })
        );
    }
});

module.exports = RoomReservation;