const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/actions');
const NewReservationStore = require('core/calendar/newReservationStore');
import {cellWidth, cellHeight, headHeight, monthHeight} from 'core/enums';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import RoomsStore from 'core/roomsStore';
import {diffDays} from 'core/utils/utils';

let SheetNewReservation = React.createClass({

    getInitialState: function(){
        return {
            drag: false,
            dragDirection: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null,
            move: false,
            moveFromLeft: null,
            moveFromX: null
        };
    },

    deselectRoom: function(roomId) {
        this.props.context.getStore(NewReservationStore).deselectRoom(roomId);
    },
    
    startMove: function(e, roomId, direction) {
        let $roomReservation = $('#sheet-new-reservation-' + roomId);
        this.setState({
            move: roomId,
            moveFromLeft: $roomReservation.position().left,
            moveFromX: e.clientX
        });
        global.window.addEventListener('mousemove', this.move);
        global.window.addEventListener('mouseup', this.stopMove);
    },
    
    move: function(e) {
        let $roomReservation = $('#sheet-new-reservation-' + this.state.move);
        $roomReservation.css({left: this.state.moveFromLeft + e.clientX - this.state.moveFromX});
    },
    
    stopMove: function(e) {
        let days = (e.clientX - this.state.moveFromX) / cellWidth;
        if (Math.abs(days) > 0.5) {
            this.props.context.getStore(NewReservationStore).addRoomReservationDays(this.state.move, days, ['dateFrom', 'dateTo']);
        }
        else {
            $('#sheet-new-reservation-' + this.state.move).width(this.state.moveFromWidth).css({left: this.state.moveFromLeft});
        }
        this.setState({
            move: false,
            moveFromLeft: null,
            moveFromX: null
        });
        global.window.removeEventListener('mousemove', this.move);
        global.window.removeEventListener('mouseup', this.stopMove);
    },

    startDrag: function(e, roomId, direction) {
        e.stopPropagation();
        e.preventDefault();
        let $roomReservation = $('#sheet-new-reservation-' + roomId);
        this.setState({
            drag: roomId,
            dragDirection: direction,
            dragFromWidth: $roomReservation.width(),
            dragFromLeft: $roomReservation.position().left,
            dragFromX: e.clientX
        });
        global.window.addEventListener('mousemove', this.drag);
        global.window.addEventListener('mouseup', this.stopDrag);
    },

    drag: function(e) {
        let $roomReservation = $('#sheet-new-reservation-' + this.state.drag);
        if (this.state.dragDirection == 'left') {
            $roomReservation.width(this.state.dragFromWidth + this.state.dragFromX - e.clientX);
            $roomReservation.css({left: this.state.dragFromLeft + e.clientX - this.state.dragFromX});
        }
        else {
            $roomReservation.width(this.state.dragFromWidth + e.clientX - this.state.dragFromX);
        }
    },

    stopDrag: function(e) {
        let days = (e.clientX - this.state.dragFromX) / cellWidth;
        if (Math.abs(days) > 0.5) {
            this.props.context.getStore(NewReservationStore).addRoomReservationDays(
                this.state.drag, days, [this.state.dragDirection == 'left' ? 'dateFrom' : 'dateTo']);
        }
        else {
            $('#sheet-new-reservation-' + this.state.drag).width(this.state.dragFromWidth).css({left: this.state.dragFromLeft});
        }
        this.setState({
            drag: false,
            dragDirection: null,
            dragFromWidth: null,
            dragFromLeft: null,
            dragFromX: null
        });
        global.window.removeEventListener('mousemove', this.drag);
        global.window.removeEventListener('mouseup', this.stopDrag);
    },
    
    shouldComponentUpdate: function(nextProps, nextState) {
        // return !_.isEqual(this.props.roomReservations, nextProps.roomReservations);
        return true;
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
                            <div className="reservation-body" onMouseDown={(e) => this.startMove(e, roomReservation.roomId)}>
                                <div className="drag drag-left" onMouseDown={(e) => this.startDrag(e, roomReservation.roomId, 'left')} />
                                <div className="drag drag-right" onMouseDown={(e) => this.startDrag(e, roomReservation.roomId, 'right')} />
                                <span>{trans('NEW_RESERVATION')}</span>
                                <Glyphicon glyph="remove" onClick={() => {this.deselectRoom(roomReservation.roomId);}} />
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
