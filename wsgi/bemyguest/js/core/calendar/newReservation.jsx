const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const NewReservationStore = require('core/calendar/newReservationStore');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import {Glyphicon, Button} from 'react-bootstrap';
import RoomsStore from 'core/roomsStore';
import CreateReservation from 'core/calendar/createReservation';

let NewReservation = React.createClass({
    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },
    
    createReservation: function() {
        this.refs.createReservation.refs.wrappedElement.open();
    },
    
    render: function() {
        let {context, dateFrom, dateTo, roomReservations} = this.props;
        if (_.isEmpty(roomReservations)) return null;
        let fullCapacity = 0;
        let roomReservationsToRender = _.map(roomReservations, (roomReservation, i) => {
            let reservationDays = moment(roomReservation.dateTo).startOf('day').diff(moment(roomReservation.dateFrom).startOf('day'), 'days') + 1;
            let room = context.getStore(RoomsStore).getRoom(roomReservation.roomId);
            fullCapacity += room.capacity;
            return (
                <div
                    key={'new-reservation-' + i}
                    className="new-reservation-room">
                    <h4><span className="room-name">{room.name}</span> <span className="house-name">({room.house.name})</span></h4>
                    <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.roomId);}} />
                    <p className="capacity">{trans('CAPACITY', {count: room.capacity})}</p>
                    <p className="date">{roomReservation.dateFrom.format('D. MMMM YYYY')} - {roomReservation.dateTo.format('D. MMMM YYYY')}</p>
                </div>
            );
        });
        return (
            <div className="new-reservation">
                <h2 className="new-label">{trans('NEW_RESERVATION')}</h2>
                <p className="full-capacity">{trans('FULL_CAPACITY', {count: fullCapacity})}</p>
                {roomReservationsToRender}
                <Button bsStyle="primary" onClick={this.createReservation}>{trans('CREATE_RESERVATION')}</Button>
                <CreateReservation ref='createReservation' context={context} roomReservations={roomReservations} />
            </div>
        );
    }
});

NewReservation = connectToStores(NewReservation, [NewReservationStore], (context, props) => ({
    roomReservations: context.getStore(NewReservationStore).getRoomReservations()
}));

module.exports = provideContext(NewReservation);
