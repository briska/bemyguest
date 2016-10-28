const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const trans = require('core/utils/trans');
const cx = require('classnames');
import {cellWidth, cellHeight, headHeight, monthHeight, detailsWidth} from 'core/enums';
import RoomsStore from 'core/roomsStore';
const GuestsStore = require('core/guestsStore');
import {substr, approvalBy, getDatesRange} from 'core/utils/utils';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Overlay from 'react-bootstrap/lib/Overlay';
const connectToStores = require('fluxible-addons-react/connectToStores');

let RoomReservationDetails = React.createClass({
    getInitialState: function(){
        return {
            show: false
        };
    },

    open: function() {
        this.setState({show: true});
        global.window.addEventListener('mousedown', this.globalClose);
    },

    close: function() {
        this.setState({show: false});
        global.window.removeEventListener('mousedown', this.globalClose);
    },

    isOpened: function() {
        return this.state.show;
    },

    globalClose: function(e) {
        if (!this.props.getTarget().contains(e.target) && !ReactDOM.findDOMNode(this.refs.details).contains(e.target)) {
            this.close();
        }
    },

    toggle: function() {
        this.state.show ? this.close() : this.open();
    },

    render: function() {
        let {context, roomReservation, reservation, room, getTarget} = this.props;
        let {show} = this.state;
        let contact = _.filter([reservation.contactName, reservation.contactMail, reservation.contactPhone], null);
        let guestsFromStore = this.props.context.getStore(GuestsStore).getGuests(roomReservation.guests);
        let guests = _.map(guestsFromStore, (guest) => {
            return _.filter([guest.namePrefix, guest.name, guest.surname, guest.nameSuffix], null).join(' ');
        });
        let roomIds = _.map(reservation.roomReservations, 'roomId');
        let rooms = _.map(context.getStore(RoomsStore).getRooms(roomIds), 'name');
        let datesRange = getDatesRange(reservation.dateFrom, reservation.dateTo);
        return (
            <Overlay
                show={show}
                target={getTarget}
                animation={false}
                placement="bottom">
                <div className="room-reservation-details" ref="details">
                    <h4 className="room-name">{room.name}</h4>
                    <p className="dates">{roomReservation.dateFrom.format('D. MMMM YYYY ')} - {roomReservation.dateTo.format('D. MMMM YYYY')}</p>
                    {!_.isEmpty(guests) &&
                        <p className="guests"><span className="caption">{trans('GUESTS')}:</span> {guests.join(', ')}</p>}
                    <div className="separator" />
                    <h4 className="name">{reservation.name || trans('RESERVATION')}</h4>
                    <p className="guests-count"><span className="caption">{trans('GUESTS_COUNT')}:</span> {reservation.guestsCount || 0}</p>
                    {!_.isEmpty(rooms) &&
                        <p className="rooms"><span className="caption">{trans('ROOMS')}:</span> {rooms.join(', ')}</p>}
                    {!_.isEmpty(contact) &&
                        <p className="contact"><span className="caption">{trans('CONTACT')}:</span> {contact.join(', ')}</p>}
                    {reservation.purpose &&
                        <p className="purpose"><span className="caption">{trans('PURPOSE')}:</span> {substr(reservation.purpose, 200)}</p>}
                    {reservation.spiritualGuide &&
                        <p className="spiritual-guide"><span className="caption">{trans('SPIRITUAL_GUIDE')}:</span> {reservation.spiritualGuide}</p>}
                    <p className="price-payed"><span className="caption">{trans('PRICE_PAYED')}:</span> {reservation.pricePayed} €</p>
                    {reservation.notes &&
                        <p className="notes"><span className="caption">{trans('NOTES')}:</span> {substr(reservation.notes, 200)}</p>}
                    {!reservation.approved &&
                        <p className="approval"><span className="text-warning">{trans('WAITING_FOR_APPROVAL.' + approvalBy(_.size(datesRange)))}</span></p>}
                    <span className="top-right"><Glyphicon glyph="remove" ref="close" onClick={this.close} /></span>
                </div>
            </Overlay>
        );
    }
});

RoomReservationDetails = connectToStores(RoomReservationDetails, [GuestsStore], (context, props) => ({
    guestsUpdated: context.getStore(GuestsStore).getUpdated()
}));

module.exports = RoomReservationDetails;
