const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const actions = require('core/actions');
import {Modal, Glyphicon, Button} from 'react-bootstrap';
import RoomsStore from 'core/roomsStore';
import Textarea from 'react-textarea-autosize';
import CreateReservationGuest from 'core/calendar/createReservationGuest';
import CreateReservationMeal from 'core/calendar/createReservationMeal';
import CalendarHeader from 'core/calendar/calendarHeader';
import {cellHeight, cellWidth, headHeight, monthHeight, MEAL_TYPES, DIETS} from 'core/enums';
import {getHousingPrice, getSpiritualPrice} from 'core/utils/utils';

let CreateReservation = React.createClass({
    getInitialState: function() {
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
    
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.capacity != this.props.capacity
            || !_.isEqual(nextProps.datesRange, this.props.datesRange)) {
            this.setState({guestsCount: nextProps.capacity});
        }
    },
    
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.show || nextState.show;
    },
    
    open: function() {
        this.setState({show: true});
    },
    
    close: function() {
        this.setState({show: false});
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    saveReservation: function(event) {
        let roomReservations = _.map(this.props.roomReservations, (roomReservation) => {
            let room = this.props.context.getStore(RoomsStore).getRoom(roomReservation.roomId);
            roomReservation.dateFrom.hour(14);
            roomReservation.dateTo.hour(10);
            roomReservation.guests = [];
            for (let index = 0; index < room.capacity; index++) {
                let guest = this.refs['guestR' + room.id + 'I' + index].getGuest();
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
        let meals = _.map(this.props.datesRange, (date, i) => {
            let counts = _.times(_.size(MEAL_TYPES), () => {
                return _.times(_.size(DIETS), (n) => {
                    return (n === 0 ? this.state.guestsCount : 0);
                });
            });
            if (date.isSame(_.first(this.props.datesRange), 'day')) {
                counts[MEAL_TYPES.BREAKFAST][DIETS.NONE_DIET] = 0;
                counts[MEAL_TYPES.LUNCH][DIETS.NONE_DIET] = 0;
            }
            if (date.isSame(_.last(this.props.datesRange), 'day')) {
                counts[MEAL_TYPES.LUNCH][DIETS.NONE_DIET] = 0;
                counts[MEAL_TYPES.DINNER][DIETS.NONE_DIET] = 0;
            }
            return {
                date: date,
                counts: counts
            };
        });
        let reservation = {
            name: this.state.name,
            guestsCount: this.state.guestsCount,
            purpose: this.state.purpose,
            spiritualGuide: this.state.spiritualGuide,
            contactName: this.state.contactName,
            contactMail: this.state.contactMail,
            contactPhone: this.state.contactPhone,
            notes: this.state.notes,
            mailCommunication: this.state.mailCommunication,
            priceHousing: getHousingPrice(_.size(this.props.datesRange)),
            priceSpiritual: getSpiritualPrice(_.size(this.props.datesRange)),
            roomReservations: roomReservations,
            meals: meals
        };
        this.props.context.executeAction(actions.createReservation, reservation);
    },
    
    render: function() {
        let {context, roomReservations, datesRange} = this.props;
        let {show, name, guestsCount, purpose, spiritualGuide, contactName, contactMail, contactPhone, notes, mailCommunication} = this.state;
        let roomReservationsToRender = _.map(roomReservations, (roomReservation) => {
            let room = context.getStore(RoomsStore).getRoom(roomReservation.roomId);
            return (
                <div
                    key={'create-reservation-' + room.id}
                    className="form-group">
                    <h4><span className="room-name">{room.name}</span> <span className="house-name">({room.house.name})</span></h4>
                    <p className="date">{roomReservation.dateFrom.format('D. MMMM YYYY')} - {roomReservation.dateTo.format('D. MMMM YYYY')}</p>
                    {_.map(_.range(room.capacity), (index) => {
                        return (
                            <CreateReservationGuest
                                key={'guest-' + room.id + '-' + index}
                                ref={'guestR' + room.id + 'I' + index}
                                context={context} />
                        );
                    })}
                </div>
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
        return (
            <Modal dialogClassName="create-reservation" bsSize="lg" show={show}>
                <Modal.Header closeButton onHide={this.close}>
                    <h3 className="title">{trans('NEW_RESERVATION')}</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div>
                            <label className="inline">{trans('RESERVATION_NAME')}</label>
                            <input type="text" value={name} name="name" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label className="inline">{trans('GUESTS_COUNT')}</label>
                            <input type="number" value={guestsCount} name="guestsCount" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group rooms">
                        {roomReservationsToRender}
                    </div>
                    {false && // hide meals when creating reservation
                        <div className="form-group meals"> 
                            <div className="meal-types calendar-aside" style={{marginTop: monthHeight + 'px'}}>
                                <div className="aside-cell" style={{height: headHeight + 'px'}}></div>
                                <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('BREAKFAST')}</div>
                                <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('LUNCH')}</div>
                                <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('DINNER')}</div>
                            </div>
                            <div className="calendar-sheet-container">
                                <div className="calendar-sheet" style={{width: _.size(datesRange) * cellWidth + 'px'}}>
                                    <CalendarHeader context={context} dates={datesRange} />
                                    <div className="calendar-table">
                                        {mealsToRender}
                                    </div>
                                </div>
                            </div>
                        </div>}
                    <div className="form-group">
                        <label className="block">{trans('PURPOSE')}</label>
                        <Textarea value={purpose} name="purpose" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="block">{trans('SPIRITUAL_GUIDE')}</label>
                        <input type="text" value={spiritualGuide} name="spiritualGuide" onChange={this.handleChange} />
                    </div>
                    <div className="form-group contact">
                        <h4>{trans('CONTACT')}</h4>
                        <div>
                            <label className="inline">{trans('CONTACT_NAME')}</label>
                            <input type="text" value={contactName} name="contactName" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label className="inline">{trans('CONTACT_MAIL')}</label>
                            <input type="email" value={contactMail} name="contactMail" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label className="inline">{trans('CONTACT_PHONE')}</label>
                            <input type="text" value={contactPhone} name="contactPhone" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="block">{trans('NOTES')}</label>
                        <Textarea value={notes} name="notes" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="block">{trans('MAIL_COMMUNICATION')}</label>
                        <textarea className="mail-communication" value={mailCommunication} name="mailCommunication" onChange={this.handleChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>{trans('CANCEL')}</Button>
                    <Button bsStyle="primary" onClick={this.saveReservation}>{trans('SAVE_RESERVATION')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = CreateReservation;
