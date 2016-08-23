'use strict';

var _Modal = require('react-bootstrap/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _reactTextareaAutosize = require('react-textarea-autosize');

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

var _createReservationGuest = require('core/calendar/createReservationGuest');

var _createReservationGuest2 = _interopRequireDefault(_createReservationGuest);

var _createReservationMeal = require('core/calendar/createReservationMeal');

var _createReservationMeal2 = _interopRequireDefault(_createReservationMeal);

var _calendarHeader = require('core/calendar/calendarHeader');

var _calendarHeader2 = _interopRequireDefault(_calendarHeader);

var _enums = require('core/enums');

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
var actions = require('core/actions');


var CreateReservation = React.createClass({
    displayName: 'CreateReservation',

    getInitialState: function getInitialState() {
        return {
            show: false,
            name: '',
            guestsCount: this.props.capacity,
            purpose: '',
            spiritualGuide: '',
            contactName: '',
            contactMail: '',
            contactPhone: '',
            notes: '',
            mailCommunication: ''
        };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.capacity != this.props.capacity || !_.isEqual(nextProps.datesRange, this.props.datesRange)) {
            this.setState({ guestsCount: nextProps.capacity });
        }
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

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    saveReservation: function saveReservation(event) {
        var _this = this;

        var roomReservations = _.map(this.props.roomReservations, function (roomReservation) {
            var room = _this.props.context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId);
            roomReservation.dateFrom.hour(14);
            roomReservation.dateTo.hour(10);
            roomReservation.guests = [];
            for (var index = 0; index < room.capacity; index++) {
                var guest = _this.refs['guestR' + room.id + 'I' + index].getGuest();
                if (guest) {
                    roomReservation.guests.push(guest);
                }
            }
            return roomReservation;
        });
        //        let meals = _.map(this.props.datesRange, (date, i) => {
        //            return {
        //                date: date,
        //                counts: _.map(MEAL_TYPES, (type) => {
        //                    return this.refs['mealD' + i + 'T' + type].getCounts();
        //                })
        //            };
        //        });
        var meals = _.map(this.props.datesRange, function (date, i) {
            var counts = _.times(_.size(_enums.MEAL_TYPES), function () {
                return _.times(_.size(_enums.DIETS), function (n) {
                    return n === 0 ? _this.state.guestsCount : 0;
                });
            });
            if (date.isSame(_.first(_this.props.datesRange), 'day')) {
                counts[_enums.MEAL_TYPES.BREAKFAST][_enums.DIETS.NONE_DIET] = 0;
                counts[_enums.MEAL_TYPES.LUNCH][_enums.DIETS.NONE_DIET] = 0;
            }
            if (date.isSame(_.last(_this.props.datesRange), 'day')) {
                counts[_enums.MEAL_TYPES.LUNCH][_enums.DIETS.NONE_DIET] = 0;
                counts[_enums.MEAL_TYPES.DINNER][_enums.DIETS.NONE_DIET] = 0;
            }
            return {
                date: date,
                counts: counts
            };
        });
        var reservation = {
            name: this.state.name,
            guestsCount: this.state.guestsCount,
            purpose: this.state.purpose,
            spiritualGuide: this.state.spiritualGuide,
            contactName: this.state.contactName,
            contactMail: this.state.contactMail,
            contactPhone: this.state.contactPhone,
            notes: this.state.notes,
            mailCommunication: this.state.mailCommunication,
            priceHousing: (0, _utils.getHousingPrice)(_.size(this.props.datesRange)),
            priceSpiritual: (0, _utils.getSpiritualPrice)(_.size(this.props.datesRange)),
            roomReservations: roomReservations,
            meals: meals
        };
        this.props.context.executeAction(actions.createReservation, reservation);
    },

    render: function render() {
        var _props = this.props;
        var context = _props.context;
        var roomReservations = _props.roomReservations;
        var datesRange = _props.datesRange;
        var _state = this.state;
        var show = _state.show;
        var name = _state.name;
        var guestsCount = _state.guestsCount;
        var purpose = _state.purpose;
        var spiritualGuide = _state.spiritualGuide;
        var contactName = _state.contactName;
        var contactMail = _state.contactMail;
        var contactPhone = _state.contactPhone;
        var notes = _state.notes;
        var mailCommunication = _state.mailCommunication;

        var roomReservationsToRender = _.map(roomReservations, function (roomReservation) {
            var room = context.getStore(_roomsStore2.default).getRoom(roomReservation.roomId);
            return React.createElement(
                'div',
                {
                    key: 'create-reservation-' + room.id,
                    className: 'form-group' },
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
                    'p',
                    { className: 'date' },
                    roomReservation.dateFrom.format('D. MMMM YYYY'),
                    ' - ',
                    roomReservation.dateTo.format('D. MMMM YYYY')
                ),
                _.map(_.range(room.capacity), function (index) {
                    return React.createElement(_createReservationGuest2.default, {
                        key: 'guest-' + room.id + '-' + index,
                        ref: 'guestR' + room.id + 'I' + index,
                        context: context });
                })
            );
        });
        //        let mealsToRender = _.map(MEAL_TYPES, (type) => {
        //            return (
        //                <div className="calendar-row">
        //                    {_.map(datesRange, (date, i) => {
        //                        return (
        //                            <CreateReservationMeal
        //                                key={'meal-' + i + '-' + type}
        //                                ref={'mealD' + i + 'T' + type}
        //                                context={context}
        //                                count={guestsCount} />
        //                        )
        //                    })}
        //                </div>
        //            );
        //        });
        return React.createElement(
            _Modal2.default,
            { dialogClassName: 'create-reservation', bsSize: 'lg', show: show },
            React.createElement(
                _Modal2.default.Header,
                { closeButton: true, onHide: this.close },
                React.createElement(
                    'h3',
                    { className: 'title' },
                    trans('NEW_RESERVATION')
                )
            ),
            React.createElement(
                _Modal2.default.Body,
                null,
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'inline' },
                            trans('RESERVATION_NAME')
                        ),
                        React.createElement('input', { type: 'text', value: name, name: 'name', onChange: this.handleChange })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'inline' },
                            trans('GUESTS_COUNT')
                        ),
                        React.createElement('input', { type: 'number', value: guestsCount, name: 'guestsCount', onChange: this.handleChange })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'form-group rooms' },
                    roomReservationsToRender
                ),
                false && // hide meals when creating reservation
                React.createElement(
                    'div',
                    { className: 'form-group meals' },
                    React.createElement(
                        'div',
                        { className: 'meal-types calendar-aside', style: { marginTop: _enums.monthHeight + 'px' } },
                        React.createElement('div', { className: 'aside-cell', style: { height: _enums.headHeight + 'px' } }),
                        React.createElement(
                            'div',
                            { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                            trans('BREAKFAST')
                        ),
                        React.createElement(
                            'div',
                            { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                            trans('LUNCH')
                        ),
                        React.createElement(
                            'div',
                            { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                            trans('DINNER')
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'calendar-sheet-container' },
                        React.createElement(
                            'div',
                            { className: 'calendar-sheet', style: { width: _.size(datesRange) * _enums.cellWidth + 'px' } },
                            React.createElement(_calendarHeader2.default, { context: context, dates: datesRange }),
                            React.createElement(
                                'div',
                                { className: 'calendar-table' },
                                mealsToRender
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'block' },
                        trans('PURPOSE')
                    ),
                    React.createElement(_reactTextareaAutosize2.default, { value: purpose, name: 'purpose', onChange: this.handleChange })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'block' },
                        trans('SPIRITUAL_GUIDE')
                    ),
                    React.createElement('input', { type: 'text', value: spiritualGuide, name: 'spiritualGuide', onChange: this.handleChange })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group contact' },
                    React.createElement(
                        'h4',
                        null,
                        trans('CONTACT')
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'inline' },
                            trans('CONTACT_NAME')
                        ),
                        React.createElement('input', { type: 'text', value: contactName, name: 'contactName', onChange: this.handleChange })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'inline' },
                            trans('CONTACT_MAIL')
                        ),
                        React.createElement('input', { type: 'email', value: contactMail, name: 'contactMail', onChange: this.handleChange })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'inline' },
                            trans('CONTACT_PHONE')
                        ),
                        React.createElement('input', { type: 'text', value: contactPhone, name: 'contactPhone', onChange: this.handleChange })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'block' },
                        trans('NOTES')
                    ),
                    React.createElement(_reactTextareaAutosize2.default, { value: notes, name: 'notes', onChange: this.handleChange })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { className: 'block' },
                        trans('MAIL_COMMUNICATION')
                    ),
                    React.createElement('textarea', { className: 'mail-communication', value: mailCommunication, name: 'mailCommunication', onChange: this.handleChange })
                )
            ),
            React.createElement(
                _Modal2.default.Footer,
                null,
                React.createElement(
                    _Button2.default,
                    { onClick: this.close },
                    trans('CANCEL')
                ),
                React.createElement(
                    _Button2.default,
                    { bsStyle: 'primary', onClick: this.saveReservation },
                    trans('SAVE_RESERVATION')
                )
            )
        );
    }
});

module.exports = CreateReservation;