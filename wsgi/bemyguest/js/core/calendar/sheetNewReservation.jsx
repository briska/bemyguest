const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const NewReservationStore = require('core/calendar/newReservationStore');
import {cellWidth, cellHeight, headHeight, monthHeight, DRAG_TYPE} from 'core/enums';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import RoomsStore from 'core/roomsStore';
import {diffDays} from 'core/utils/utils';

let SheetNewReservation = React.createClass({

    getInitialState: function(){
        return {
            drag: null,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null
        };
    },

    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },

    startDrag: function(e, roomId, dragType) {
        e.stopPropagation();
        e.preventDefault();
        let $roomReservationEl = $('#sheet-new-reservation-' + roomId);
        this.setState({
            drag: roomId,
            dragType: dragType,
            dragFromWidth: $roomReservationEl.width(),
            dragFromLeft: $roomReservationEl.position().left,
            dragFromX: e.clientX
        });
        global.window.addEventListener('mousemove', this.drag);
        global.window.addEventListener('mouseup', this.stopDrag);
    },

    drag: function(e) {
        let {drag, dragType, dragFromWidth, dragFromLeft, dragFromX} = this.state;
        let $roomReservationEl = $('#sheet-new-reservation-' + drag);
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.RIGHT) {
            $roomReservationEl.width(dragFromWidth + dragType * (e.clientX - dragFromX));
        }
        if (dragType == DRAG_TYPE.LEFT || dragType == DRAG_TYPE.MOVE) {
            $roomReservationEl.css({left: dragFromLeft + e.clientX - dragFromX});
        }
    },

    stopDrag: function(e) {
        let {drag, dragType, dragFromWidth, dragFromLeft, dragFromX} = this.state;
        this.setState({
            drag: null,
            dragType: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null
        });
        global.window.removeEventListener('mousemove', this.drag);
        global.window.removeEventListener('mouseup', this.stopDrag);
        let days = (e.clientX - dragFromX) / cellWidth;
        if (Math.abs(days) > 0.5) {
            this.props.context.getStore(NewReservationStore).addRoomReservationDays(drag, days, dragType);
        }
        else {
            $('#sheet-new-reservation-' + drag).width(dragFromWidth).css({left: dragFromLeft});
        }
    },

    render: function() {
        let {context, dateFrom, dateTo, roomReservations} = this.props;
        return (
            <div className="sheet-new-reservation">
                {_.map(roomReservations, (roomReservation) => {
                    let roomReservationDays = diffDays(roomReservation.dateFrom, roomReservation.dateTo);
                    let roomIndex = context.getStore(RoomsStore).getRoomIndex(roomReservation.roomId);
                    return (
                        <div
                            key={'sheet-new-reservation-' + roomReservation.roomId}
                            id={'sheet-new-reservation-' + roomReservation.roomId}
                            className={cx('room-reservation', 'reservation-new')}
                            style={{
                                width: (roomReservationDays - 1) * cellWidth + 'px',
                                minWidth: cellWidth / 2 + 'px',
                                height: cellHeight + 'px',
                                left: (diffDays(dateFrom, roomReservation.dateFrom) - 0.5) * cellWidth + 'px',
                                top: headHeight + monthHeight + roomIndex * cellHeight + 'px'}}>
                            <div className="reservation-body" onMouseDown={(e) => this.startDrag(e, roomReservation.roomId, DRAG_TYPE.MOVE)}>
                                <div className="drag drag-left" onMouseDown={(e) => this.startDrag(e, roomReservation.roomId, DRAG_TYPE.LEFT)} />
                                <div className="drag drag-right" onMouseDown={(e) => this.startDrag(e, roomReservation.roomId, DRAG_TYPE.RIGHT)} />
                                <span>{trans('NEW_RESERVATION')}</span>
                                {roomReservationDays > 1 &&
                                    <span className="top-right">
                                        <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.roomId);}} />
                                    </span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
});

SheetNewReservation = connectToStores(SheetNewReservation, [NewReservationStore], (context, props) => ({
    roomReservations: context.getStore(NewReservationStore).getRoomReservations()
}));

module.exports = SheetNewReservation;
