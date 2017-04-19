const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import {cellWidth, cellHeight, headHeight, monthHeight, DRAG_TYPE, DATE_FORMAT} from 'core/enums';
import {diffDays} from 'core/utils/utils';
import RoomsStore from 'core/roomsStore';
import RoomReservationDetails from 'core/calendar/roomReservationDetails';
import actions from 'core/actions';
import ConfirmDialog from 'core/utils/confirmDialog';

let SheetRoomReservation = React.createClass({
    getInitialState: function(){
        this.dragging = false;
        return {
            wasDetailsOpened: false,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null,
            roomIndex: null,
            dragFromTop: null,
            dragFromY: null
        };
    },

    showDetails: function(e) {
        let {wasDetailsOpened, dragFromX, dragFromY} = this.state;
        if (wasDetailsOpened) return;
        if (dragFromX) {
            let days = (e.clientX - dragFromX) / cellWidth;
            if (Math.abs(days) > 0.5) {
                return;
            }
        }
        if (dragFromY) {
            let rooms = (e.clientY - dragFromY) / cellHeight;
            if (Math.abs(rooms) > 0.5) {
                return;
            }
        }
        this.refs.roomReservationDetails.refs.wrappedElement.toggle();
    },

    showFullDetails: function(e) {
        this.refs.roomReservationDetails.refs.wrappedElement.close();
        this.props.getReservationDetails().open();
    },

    startDrag: function(e, dragType) {
        if (this.dragging) return;
        this.dragging = true;
        e.preventDefault();
        if (this.refs.roomReservationDetails.refs.wrappedElement.isOpened()) {
            this.refs.roomReservationDetails.refs.wrappedElement.close();
            this.setState({
                wasDetailsOpened: true
            });
        }
        let $roomReservationEl = $(ReactDOM.findDOMNode(this));
        this.setState({
            dragType: dragType,
            dragFromWidth: $roomReservationEl.width(),
            dragFromLeft: $roomReservationEl.position().left,
            dragFromX: e.clientX,
            dragFromTop: $roomReservationEl.position().top,
            dragFromY: e.clientY
        });
        global.window.addEventListener('mousemove', this.drag);
        global.window.addEventListener('mouseup', this.stopDrag);
    },

    drag: function(e) {
        let {dragType, dragFromWidth, dragFromLeft, dragFromX, dragFromTop, dragFromY} = this.state;
        let $roomReservationEl = $(ReactDOM.findDOMNode(this));
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.RIGHT) {
            $roomReservationEl.width(dragFromWidth + dragType * Math.round((e.clientX - dragFromX) / cellWidth) * cellWidth);
        }
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
            $roomReservationEl.css({left: dragFromLeft + Math.round((e.clientX - dragFromX) / cellWidth) * cellWidth});
        }
        if (dragType == DRAG_TYPE.MOVE) {
            let newTop = dragFromTop + Math.round((e.clientY - dragFromY) / cellHeight) * cellHeight;
            if (newTop >= headHeight + monthHeight && newTop <= headHeight + monthHeight + (context.getStore(RoomsStore).getRoomsCount() - 1) * cellHeight) {
                $roomReservationEl.css({top: newTop});
            }
        }
    },

    stopDrag: function(e) {
        this.dragging = false;
        let {context, reservation, roomReservation} = this.props;
        let {dragType, dragFromWidth, dragFromLeft, dragFromX, dragFromTop, dragFromY} = this.state;
        let $roomReservationEl = $(ReactDOM.findDOMNode(this));
        this.setState({
            wasDetailsOpened: false,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null,
            dragFromTop: null,
            dragFromY: null
        });
        global.window.removeEventListener('mousemove', this.drag);
        global.window.removeEventListener('mouseup', this.stopDrag);

        let roomId = roomReservation.roomId;

        let days = Math.round((e.clientX - dragFromX) / cellWidth);
        let dateChanged = Math.abs(days);

        let rooms = Math.round((e.clientY - dragFromY) / cellHeight);
        let roomChanged = Math.abs(rooms);
        if (roomChanged) {
            let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId) + rooms;
            roomIndex = Math.max(roomIndex, 0);
            roomIndex = Math.min(roomIndex, context.getStore(RoomsStore).getRoomsCount() - 1);
            let newRoom = context.getStore(RoomsStore).getRoomByIndex(roomIndex);
            if (newRoom.id != roomId) {
                roomId = newRoom.id;
            }
            else {
                roomChanged = false;
            }
        }

        let confirm = null;
        if (dateChanged && roomChanged) confirm = this.refs.moveAndRoomConfirm;
        else if (dateChanged) confirm = this.refs.moveConfirm;
        else if (roomChanged) confirm = this.refs.roomConfirm;

        if (confirm) {
            if (!roomChanged) $roomReservationEl.css({top: dragFromTop});
            confirm.open(() => {
                let payload = {
                    id: reservation.id,
                    data: {
                        roomReservation: {
                            id: roomReservation.id,
                            roomId: roomId
                        }
                    }
                };
                if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
                    payload.data.roomReservation.dateFrom = moment(roomReservation.dateFrom).add(days, 'days').hour(14).format(DATE_FORMAT);
                }
                if (dragType == DRAG_TYPE.RIGHT || dragType == DRAG_TYPE.MOVE)  {
                    payload.data.roomReservation.dateTo = moment(roomReservation.dateTo).add(days, 'days').hour(10).format(DATE_FORMAT);
                }
                context.executeAction(actions.editReservation, payload);
            }, ()=> {
                $roomReservationEl.width(dragFromWidth).css({left: dragFromLeft, top: dragFromTop});
            });
        }
        else {
            $roomReservationEl.width(dragFromWidth).css({left: dragFromLeft, top: dragFromTop});
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
                    ref="moveAndRoomConfirm"
                    body={trans('CONFIRM_ROOM_RESERVATION_DATES_AND_ROOM_CHANGE')} />
                <ConfirmDialog
                    ref="moveConfirm"
                    body={trans('CONFIRM_ROOM_RESERVATION_DATES_CHANGE')} />
                <ConfirmDialog
                    ref="roomConfirm"
                    body={trans('CONFIRM_ROOM_RESERVATION_ROOM_CHANGE')} />
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
