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
import {Modal, Glyphicon, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import RoomsStore from 'core/roomsStore';

let CreateReservation = React.createClass({
    getInitialState: function() {
        return {show: false};
    },
    
    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },
    
    open: function() {
        this.setState({show: true});
    },
    
    close: function() {
        this.setState({show: false});
    },
    
    render: function() {
        let {context, roomReservations} = this.props;
        let {reservationName, guestsCount, contactName, contactMail, contactPhone} = this.state;
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
                    <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.room.id);}} />
                    <p className="capacity">{trans('CAPACITY', {count: room.capacity})}</p>
                    <p className="date">{roomReservation.dateFrom.format('D. MMMM YYYY')} - {roomReservation.dateTo.format('D. MMMM YYYY')}</p>
                </div>
            );
        });
        return (
            <Modal dialogClassName="create-reservation" show={this.state.show}>
                <Modal.Header closeButton onHide={this.close}>
                    <h2 className="new-label">{trans('NEW_RESERVATION')}</h2>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId="reservation-name">
                        <ControlLabel>{trans('RESERVATION_NAME')}</ControlLabel>
                        <FormControl type="text" value={reservationName} onChange={() => {this.handleChange('reservationName');}} />
                    </FormGroup>
                    <FormGroup controlId="guests-count">
                        <ControlLabel>{trans('GUESTS_COUNT')}</ControlLabel>
                        <FormControl type="number" value={guestsCount} onChange={() => {this.handleChange('guestsCount');}} />
                    </FormGroup>
                    {roomReservationsToRender}
                    <h4>{trans('CONTACT')}</h4>
                    <FormGroup controlId="contact-name">
                        <ControlLabel>{trans('CONTACT_NAME')}</ControlLabel>
                        <FormControl type="text" value={contactName} onChange={() => {this.handleChange('contactName');}} />
                    </FormGroup>
                    <FormGroup controlId="contact-mail">
                        <ControlLabel>{trans('CONTACT_MAIL')}</ControlLabel>
                        <FormControl type="email" value={contactMail} onChange={() => {this.handleChange('contactMail');}} />
                    </FormGroup>
                    <FormGroup controlId="contact-phone">
                        <ControlLabel>{trans('CONTACT_PHONE')}</ControlLabel>
                        <FormControl type="text" value={contactPhone} onChange={() => {this.handleChange('contactPhone');}} />
                    </FormGroup>
                    <Button bsStyle="primary">{trans('SAVE_RESERVATION')}</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = provideContext(CreateReservation);
