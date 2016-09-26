const React = require('react');
const trans = require('core/utils/trans');

let RoomOccupation = React.createClass({
    render: function() {
        return (
            <div className="room-occupation stats-section">
                <h2>{trans('ROOM_OCCUPATION')}</h2>
            </div>
        );
    }
});

module.exports = RoomOccupation;
