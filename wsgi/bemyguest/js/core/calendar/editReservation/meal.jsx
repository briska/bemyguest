const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const update = require('react-addons-update');
import {cellWidth, cellHeight, DIETS} from 'core/enums';

let Meal = React.createClass({
    getInitialState: function() {
        return {
            counts: this.props.counts,
            isActive: false
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

    handleClick: function() {
        this.setState({isActive: true});
    },

    updateCount: function(updateType) {
        let updatedCount = this.state.counts[DIETS['NONE_DIET']];
        if (updateType == 'plus') {
            updatedCount += 1;
        } else if (updateType == 'minus') {
            updatedCount -= 1;
        } else if (updateType == 'none') {
            updatedCount = 0;
        } else if (updateType == 'all') {
            updatedCount = this.props.guestsCount;
        }
        if (updatedCount >= 0 && updatedCount <= this.props.guestsCount) {
            this.setState({counts: update(this.state.counts, {[DIETS['NONE_DIET']]: {$set: updatedCount}})});
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.isActive) {
            this.refs.focusTarget.select();
            this.setState({isActive: false});
        }
    },

    render: function() {
        let {counts} = this.state;
        let {edit} = this.props;
        return (
            <div className="calendar-cell" style={{width: cellWidth + 'px', height: cellHeight + 'px'}} onDoubleClick={this.handleClick}>
                {edit && <input type="number" min="0" name="NONE_DIET" value={counts[DIETS.NONE_DIET]} ref="focusTarget" onChange={this.handleChange} />}
                {!edit && counts[DIETS.NONE_DIET]}
            </div>
        );
    }
});

module.exports = Meal;
