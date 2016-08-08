const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const update = require('react-addons-update');
import {cellWidth, cellHeight, DIETS} from 'core/enums';

let Meal = React.createClass({
    getInitialState: function() {
        return {
            counts: this.props.counts
        };
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (!_.isEqual(this.props.counts, nextProps.counts)) {
            this.setState({counts: nextProps.counts});
        }
    },
    
    handleChange: function(e) {
        this.setState({counts: update(this.state.counts, {[DIETS[e.target.name]]: {$set: parseInt(e.target.value)}})});
    },
    
    cancel: function() {
        this.setState({counts: this.props.counts});
    },
    
    getCounts: function() {
        return this.state.counts;
    },
    
    render: function() {
        let {counts} = this.state;
        let {edit} = this.props;
        return (
            <div className="calendar-cell" style={{width: cellWidth + 'px', height: cellHeight + 'px'}}>
                {edit && <input type="number" name="NONE_DIET" value={counts[DIETS.NONE_DIET]} onChange={this.handleChange} />}
                {!edit && counts[DIETS.NONE_DIET]}
            </div>
        );
    }
});

module.exports = Meal;
