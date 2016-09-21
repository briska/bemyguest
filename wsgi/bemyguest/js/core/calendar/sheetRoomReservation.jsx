const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import {cellWidth, cellHeight, headHeight, monthHeight, DRAG_TYPE} from 'core/enums';
import {diffDays} from 'core/utils/utils';
import RoomsStore from 'core/roomsStore';
import RoomReservationDetails from 'core/calendar/roomReservationDetails';
import ReservationsStore from 'core/calendar/reservationsStore';
import actions from 'core/actions';
import ConfirmDialog from 'core/utils/confirmDialog';

let SheetRoomReservation = React.createClass({
    getInitialState: function(){
        return {
            wasDetailsOpened: false,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null
        };
    },

    showDetails: function(e) {
        let {wasDetailsOpened, dragFromX} = this.state;
        if (wasDetailsOpened) return;
        if (dragFromX) {
            let days = (e.clientX - dragFromX) / cellWidth;
            if (Math.abs(days) > 0.5) {
                return;
            }
        }
        this.refs.roomReservationDetails.toggle();
    },

    showFullDetails: function(e) {
        this.refs.roomReservationDetails.close();
        this.props.getReservationDetails().open();
    },

    startDrag: function(e, dragType) {
        e.stopPropagation();
        e.preventDefault();
        if (this.refs.roomReservationDetails.isOpened()) {
            this.refs.roomReservationDetails.close();
            this.setState({
                wasDetailsOpened: true
            });
        }
        let $roomReservationEl = $(ReactDOM.findDOMNode(this));
        this.setState({
            dragType: dragType,
            dragFromWidth: $roomReservationEl.width(),
            dragFromLeft: $roomReservationEl.position().left,
            dragFromX: e.clientX
        });
        global.window.addEventListener('mousemove', this.drag);
        global.window.addEventListener('mouseup', this.stopDrag);
    },

    drag: function(e) {
        let {dragType, dragFromWidth, dragFromLeft, dragFromX} = this.state;
        let $roomReservationEl = $(ReactDOM.findDOMNode(this));
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.RIGHT) {
            $roomReservationEl.width(dragFromWidth + dragType * (e.clientX - dragFromX));
        }
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
            $roomReservationEl.css({left: dragFromLeft + e.clientX - dragFromX});
        }
    },

    stopDrag: function(e) {
        let {dragType, dragFromWidth, dragFromLeft, dragFromX} = this.state;
        this.setState({
            wasDetailsOpened: false,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null
        });
        global.window.removeEventListener('mousemove', this.drag);
        global.window.removeEventListener('mouseup', this.stopDrag);

        let days = (e.clientX - dragFromX) / cellWidth;
        if (Math.abs(days) > 0.5) {
            this.refs.moveConfirm.open(() => {
                let {reservation, roomReservation} = this.props;
                let payload = {
                    id: reservation.id,
                    data: {
                        roomReservation: {
                            id: roomReservation.id,
                            roomId: roomReservation.roomId,
                            //TODO prices - surely better on server, not here in js
                        }
                    }
                };
                if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
                    payload.data.roomReservation.dateFrom = moment(roomReservation.dateFrom).add(days, 'days');
                }
                if (dragType == DRAG_TYPE.RIGHT || dragType == DRAG_TYPE.MOVE)  {
                    payload.data.roomReservation.dateTo = moment(roomReservation.dateTo).add(days, 'days');
                }
                this.props.context.executeAction(actions.editReservation, payload);
            }, ()=> {
                $(ReactDOM.findDOMNode(this)).width(dragFromWidth).css({left: dragFromLeft});
            });
        }
        else {
            $(ReactDOM.findDOMNode(this)).width(dragFromWidth).css({left: dragFromLeft});
        }
    },

    render: function() {
        let {context, dateFrom, dateTo, reservation, roomReservation} = this.props;
        let roomReservationDays = diffDays(roomReservation.dateFrom, roomReservation.dateTo);
        if (roomReservationDays <= 1) return null;
        let room = context.getStore(RoomsStore).getRoom(roomReservation.roomId);
        let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId);
        return (
            <div
                className="room-reservation"
                style={{
                    width: (roomReservationDays - 1) * cellWidth + 'px',
                    height: cellHeight + 'px',
                    left: (diffDays(dateFrom, roomReservation.dateFrom) - 0.5) * cellWidth + 'px',
                    top: headHeight + monthHeight + roomIndex * cellHeight + 'px',
                    background: reservation.color}}
                onMouseDown={(e) => this.startDrag(e, DRAG_TYPE.MOVE)}
                onMouseUp={this.showDetails}
                onDoubleClick={this.showFullDetails}>
                <ConfirmDialog
                    ref="moveConfirm"
                    body={trans('CONFIRM_ROOM_RESERVATION_DATES_CHANGE')}/>
                <div className="reservation-body">
                    <div className="drag drag-left" onMouseDown={(e) => this.startDrag(e, DRAG_TYPE.LEFT)} />
                    <div className="drag drag-right" onMouseDown={(e) => this.startDrag(e, DRAG_TYPE.RIGHT)} />
                    <span>{reservation.name ? reservation.name : reservation.contactName}</span>
                </div>
                <RoomReservationDetails
                    ref="roomReservationDetails"
                    context={context}
                    roomReservation={roomReservation}
                    reservation={reservation}
                    room={room}
                    getTarget={() => ReactDOM.findDOMNode(this)} />
            </div>
        );
    }
});

module.exports = SheetRoomReservation;
