'use strict';

var _enums = require('core/enums');

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _roomsStore = require('core/roomsStore');

var _roomsStore2 = _interopRequireDefault(_roomsStore);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
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
                var roomReservationDays = (0, _utils.diffDays)(roomReservation.dateFrom, roomReservation.dateTo);
                if (roomReservationDays <= 1) return null;
                var daysFromStart = roomReservation.dateFrom.diff(dateFrom, 'days');
                var roomIndex = context.getStore(_roomsStore2.default).getRoomIndex(roomReservation.roomId);
                return React.createElement(
                    'div',
                    {
                        key: 'sheet-new-reservation-' + i,
                        className: cx('room-reservation', 'reservation-new'),
                        style: {
                            width: (roomReservationDays - 1) * _enums.cellWidth + 'px',
                            height: _enums.cellHeight + 'px',
                            left: (daysFromStart + 0.5) * _enums.cellWidth + 'px',
                            top: _enums.headHeight + _enums.monthHeight + roomIndex * _enums.cellHeight + 'px' } },
                    React.createElement(
                        'div',
                        { className: 'reservation-body' },
                        React.createElement(
                            'span',
                            null,
                            trans('NEW_RESERVATION')
                        ),
                        React.createElement(_Glyphicon2.default, { glyph: 'remove', onClick: function onClick() {
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

module.exports = SheetNewReservation;