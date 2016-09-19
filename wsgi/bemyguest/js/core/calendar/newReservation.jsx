const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const NewReservationStore = require('core/calendar/newReservationStore');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import RoomsStore from 'core/roomsStore';
import CreateReservation from 'core/calendar/createReservation';
import {diffDays, getDatesRange} from 'core/utils/utils';

let NewReservation = React.createClass({
    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    createReservation: function() {
        this.refs.createReservation.open();
    },

    render: function() {
        let {context, dateFrom, dateTo, roomReservations} = this.props;
        if (_.isEmpty(roomReservations)
            || _.isEmpty(_.filter(roomReservations, function(roomReservation) {
                return !roomReservation.dateFrom.isSame(roomReservation.dateTo, 'day');
            }))) return null;
        let capacity = 0;
        let reservationDateFrom = roomReservations[0].dateFrom;
        let reservationDateTo = roomReservations[0].dateTo;
        let roomReservationsToRender = _.map(roomReservations, (roomReservation, i) => {
            if (roomReservation.dateFrom.isSame(roomReservation.dateTo, 'day')) return null;
            let room = context.getStore(RoomsStore).getRoom(roomReservation.roomId);
            capacity += room.capacity;
            if (roomReservation.dateFrom.isBefore(reservationDateFrom)) {
                reservationDateFrom = roomReservation.dateFrom;
            }
            if (roomReservation.dateTo.isAfter(reservationDateTo)) {
                reservationDateTo = roomReservation.dateTo;
            }
            return (
                <div
                    key={'new-reservation-' + i}
                    className="new-reservation-room">
                    <p className="room-name">{room.name}</p>
                    <span className="top-right"><Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.roomId);}} /></span>
                    <p className="house-name-capacity">{room.house.name}, {trans('CAPACITY', {count: room.capacity})}</p>
                    <p className="date-from">{trans('FROM')}: {roomReservation.dateFrom.format('D. MMMM YYYY')}</p>
                    <p className="date-to">{trans('TO')}: {roomReservation.dateTo.format('D. MMMM YYYY')}</p>
                </div>
            );
        });
        return (
            <div className="new-reservation">
                <h3 className="new-label">{trans('NEW_RESERVATION')}</h3>
                <p className="capacity">{trans('CAPACITY', {count: capacity})}</p>
                {roomReservationsToRender}
                <Button bsStyle="primary" onClick={this.createReservation}>{trans('CREATE_RESERVATION')}</Button>
                <CreateReservation
                    ref="createReservation"
                    context={context}
                    roomReservations={roomReservations}
                    capacity={capacity}
                    datesRange={getDatesRange(reservationDateFrom, reservationDateTo)} />
            </div>
        );
    }
});

NewReservation = connectToStores(NewReservation, [NewReservationStore], (context, props) => ({
    roomReservations: context.getStore(NewReservationStore).getRoomReservations()
}));

module.exports = NewReservation;
