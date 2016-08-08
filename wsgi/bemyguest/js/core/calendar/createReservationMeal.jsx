const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const update = require('react-addons-update');
import {cellWidth, cellHeight, DIETS} from 'core/enums';

let CreateReservationMeal = React.createClass({
    getInitialState: function() {
        return {
            counts: [this.props.count, 0, 0, 0]
        };
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.count != this.props.count && this.state.counts[DIETS.NONE_DIET] == this.props.count) {
            this.setState({counts: update(this.state.counts, {[DIETS.NONE_DIET]: {$set: nextProps.count}})});
        }
    },
    
    handleChange: function(e) {
        this.setState({counts: update(this.state.counts, {[DIETS[e.target.name]]: {$set: e.target.value}})});
    },
    
    getCounts: function() {
        return this.state.counts;
    },
    
    render: function() {
        let {counts} = this.state;
        return (
            <div className="calendar-cell" style={{width: cellWidth + 'px', height: cellHeight + 'px'}}>
                <input type="number" name="NONE_DIET" value={counts[DIETS.NONE_DIET]} onChange={this.handleChange} />
            </div>
        );
    }
});

module.exports = CreateReservationMeal;
