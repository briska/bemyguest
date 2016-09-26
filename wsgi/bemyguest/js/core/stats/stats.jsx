const React = require('react');
const trans = require('core/utils/trans');
import Meals from 'core/stats/meals';
import RoomOccupation from 'core/stats/roomOccupation';

let Stats = React.createClass({
    render: function() {
        return (
            <div className="stats">
                <h1>{trans('STATS')}</h1>
                <Meals />
                <RoomOccupation />
            </div>
        );
    }
});

module.exports = Stats;
