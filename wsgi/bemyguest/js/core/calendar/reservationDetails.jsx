const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import {cellWidth, cellHeight, headHeight, monthHeight, detailsWidth} from 'core/enums';
import RoomsStore from 'core/roomsStore';
import {getDatesRange} from 'core/utils/utils';
import Modal from 'react-bootstrap/lib/Modal';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Notes from 'core/calendar/editReservation/notes';
import MailCommunication from 'core/calendar/editReservation/mailCommunication';
import Name from 'core/calendar/editReservation/name';
import Contact from 'core/calendar/editReservation/contact';
import Purpose from 'core/calendar/editReservation/purpose';
import SpiritualGuide from 'core/calendar/editReservation/spiritualGuide';
import PricePayed from 'core/calendar/editReservation/pricePayed';
import GuestsCount from 'core/calendar/editReservation/guestsCount';
import OverallDate from 'core/calendar/editReservation/overallDate';
import RoomReservation from 'core/calendar/editReservation/roomReservation';
import Meals from 'core/calendar/editReservation/meals';
import Approval from 'core/calendar/editReservation/approval';
import ConfirmDialog from 'core/utils/confirmDialog';
import actions from 'core/actions';

let ReservationDetails = React.createClass({
    getInitialState: function(){
        let {reservation} = this.props;
        return {
            show: false
        };
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

    remove: function() {
        this.refs.deleteReservation.open(() => {
            this.close();
            let payload = {
                'id': this.props.reservation.id
            };
            this.props.context.executeAction(actions.removeReservation, payload);
        }, ()=> {
            return;
        });
    },

    render: function() {
        let {context, reservation} = this.props;
        let {show} = this.state;
        let datesRange = getDatesRange(reservation.dateFrom, reservation.dateTo);
        let isLastRoom = reservation.roomReservations.length == 1;
        return (
            <Modal dialogClassName="reservation-details reservation-modal" bsSize="lg" show={show} onHide={this.close}>
                <ConfirmDialog
                    ref="deleteReservation"
                    body={trans('CONFIRM_REMOVING_RESERVATION')}
                    confirmBSStyle="danger"/>
                <Modal.Header closeButton>
                    <Name context={context} reservationId={reservation.id} name={reservation.name} />
                </Modal.Header>
                <Modal.Body>
                    {!reservation.approved &&
                        <Approval context={context} reservationId={reservation.id} days={_.size(datesRange)} />}
                    <OverallDate context={context} reservationId={reservation.id} reservationDateFrom={reservation.dateFrom} reservationDateTo={reservation.dateTo} />
                    <GuestsCount context={context} reservationId={reservation.id} guestsCount={reservation.guestsCount} />
                    {_.map(reservation.roomReservations, (roomReservation) => {
                        return (
                            <RoomReservation
                                key={'detail-room-reservation-' + roomReservation.id}
                                context={context}
                                reservationId={reservation.id}
                                roomReservation={roomReservation}
                                reservationDateFrom={reservation.dateFrom}
                                reservationDateTo={reservation.dateTo}
                                isLastRoom={isLastRoom}/>
                        );
                    })}
                    <Meals context={context} reservationId={reservation.id} meals={reservation.meals} datesRange={datesRange} guestsCount={reservation.guestsCount} />
                    <Purpose context={context} reservationId={reservation.id} purpose={reservation.purpose} />
                    <SpiritualGuide context={context} reservationId={reservation.id} spiritualGuide={reservation.spiritualGuide} />
                    <Contact
                        context={context}
                        reservationId={reservation.id}
                        contactName={reservation.contactName}
                        contactMail={reservation.contactMail}
                        contactPhone={reservation.contactPhone} />
                    <PricePayed context={context} reservationId={reservation.id} pricePayed={reservation.pricePayed} />
                    <Notes context={context} reservationId={reservation.id} notes={reservation.notes} />
                    <MailCommunication context={context} reservationId={reservation.id} mailCommunication={reservation.mailCommunication} />
                </Modal.Body>
                <Modal.Footer>
                    <span className="edit-label"><Glyphicon glyph="pencil" /> {trans('USE_DOUBLECLICK_TO_EDIT')}</span>
                    <Button onClick={this.remove} bsStyle="danger">{trans('REMOVE')}</Button>
                    <Button onClick={this.close}>{trans('CLOSE')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = ReservationDetails;
