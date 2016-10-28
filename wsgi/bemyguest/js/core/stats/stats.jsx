const React = require('react');
const trans = require('core/utils/trans');
import Meals from 'core/stats/meals';
import RoomOccupation from 'core/stats/roomOccupation';
import Finances from 'core/stats/finances';

let Stats = React.createClass({
    render: function() {
        let context = this.props.context;
        return (
            <div className="stats">
                <h1>{trans('STATS')}</h1>
                <Meals context={context} />
                <RoomOccupation context={context} />
                <Finances context={context} />
            </div>
        );
    }
});

module.exports = Stats;
