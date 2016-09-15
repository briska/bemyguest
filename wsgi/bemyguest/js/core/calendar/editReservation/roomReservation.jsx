const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import RoomsStore from 'core/roomsStore';
import DatePicker from 'react-datepicker';
const moment = require('moment');
require('moment/locale/sk');
import Guest from 'core/calendar/editReservation/guest';
import {diffDays, getHousingPrice, getSpiritualPrice} from 'core/utils/utils';

let RoomReservation = React.createClass({
    getStateFromSource: function(propsSrc) {
        let roomReservation = propsSrc.roomReservation;
        return {
            edit: false,
            saving: false,
            room: context.getStore(RoomsStore).getRoom(roomReservation.roomId),
            dateFrom: roomReservation.dateFrom,
            dateTo: roomReservation.dateTo
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props);
    },
    
    handleRoom: function(e) {
        this.setState({room: context.getStore(RoomsStore).getRoom(parseInt(e.target.value))});
    },
    
    handleDate: function(key, date) {
        this.setState({[key]: date});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState(this.getStateFromSource(this.props));
    },
    
    remove: function() {
        if (!confirm(trans('CONFIRM_REMOVING_ROOM_RESERVATION'))) return;
        this.setState({saving: true});
        let payload = {
            id: this.props.reservationId,
            data: {
                roomReservationRemove: this.props.roomReservation.id
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },
    
    save: function() {
        this.setState({saving: true});
        let guests = [];
        for (let index = 0; index < this.state.room.capacity; index++) {
            let guest = this.refs['guest' + index].getGuest();
            if (guest) {
                guests.push(guest);
            }
        }
        let {room, dateFrom, dateTo} = this.state;
        let {reservationId, reservationDateFrom, reservationDateTo, roomReservation} = this.props;
        let payload = {
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
            let from = dateFrom.isBefore(reservationDateFrom, 'day') ? dateFrom : reservationDateFrom;
            let to = dateTo.isAfter(reservationDateTo, 'day') ? dateTo : reservationDateTo;
            let days = diffDays(from, to);
            payload.data.prices = {
                priceHousing: getHousingPrice(days),
                priceSpiritual: getSpiritualPrice(days)
            }
        }
        this.props.context.executeAction(actions.editReservation, payload);
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps));
        }

        if (nextProps.reservationDateFrom != this.state.dateFrom || nextProps.reservationDateTo != this.state.dateTo) {
            this.setState({dateFrom: nextProps.reservationDateFrom, dateTo: nextProps.reservationDateTo});
        }
    },
    
    render: function() {
        let {edit, saving, room, dateFrom, dateTo} = this.state;
        let guests = this.props.roomReservation.guests;
        if (edit) {
            return (
                <div className="room-reservation form-group">
                    <select onChange={this.handleRoom} value={room.id}>
                        {_.map(context.getStore(RoomsStore).getHouses(), (selectHouse) => {
                            return (
                                <optgroup label={selectHouse.name} key={'select-house-' + selectHouse.id}>
                                    {_.map(context.getStore(RoomsStore).getRooms(selectHouse.roomIds), (selectRoom) => {
                                        return (
                                            <option value={selectRoom.id} key={'select-room-' + selectRoom.id}>{selectRoom.name}</option>
                                        );
                                    })}
                                </optgroup>
                            );
                        })}
                    </select>
                    {!saving &&
                        <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                    {!saving &&
                        <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                    {!saving &&
                        <Button bsStyle="danger" className="form-group-button remove" onClick={this.remove}><Glyphicon glyph="trash" /></Button>}
                    <div className="date">
                        <DatePicker
                            dateFormat="DD. MM. YYYY"
                            selected={dateFrom}
                            maxDate={moment(dateTo).subtract(1, 'days')}
                            onChange={(date) => {this.handleDate('dateFrom', date);}} />
                        <span> - </span>
                        <DatePicker
                            dateFormat="DD. MM. YYYY"
                            selected={dateTo}
                            minDate={moment(dateFrom).add(1, 'days')}
                            onChange={(date) => {this.handleDate('dateTo', date);}} />
                    </div>
                    <div className="guests">
                        {_.map(_.range(room.capacity), (index) => {
                            return (
                                <Guest
                                    key={'detail-guest-' + index}
                                    ref={'guest' + index}
                                    context={this.props.context}
                                    guest={guests[index]} />
                            );
                        })}
                    </div>
                </div>
            );
        }
        return (
            <div className="room-reservation form-group" onDoubleClick={this.startEditing}>
                <h4><span className="room-name">{room.name}</span> <span className="house-name">({room.house.name})</span></h4>
                <div className="date">{dateFrom.format('D. MMMM YYYY')} - {dateTo.format('D. MMMM YYYY')}</div>
                {_.map(guests, (guest) => {
                    let guestName = _.filter([guest.namePrefix, guest.name, guest.surname, guest.nameSuffix], null).join(' ');
                    let guestAddress = _.filter([guest.addressStreet, guest.addressNumber, guest.addressCity], null).join(' ');
                    let guestDetails = (guestAddress ? (guest.phone ? guestAddress + ', ' + guest.phone : guestAddress) : guest.phone);
                    return (
                        <div key={'detail-guest-' + guest.id} className="detail-guest">{guestName + (guestDetails ? ' (' + guestDetails + ')' : '')}</div>
                    );
                })}
            </div>
        );
    }
});

module.exports = RoomReservation;
