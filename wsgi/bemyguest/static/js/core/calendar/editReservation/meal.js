'use strict';

var _enums = require('core/enums');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var update = require('react-addons-update');


var Meal = React.createClass({
    displayName: 'Meal',

    getInitialState: function getInitialState() {
        return {
            counts: this.props.counts
        };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.counts, nextProps.counts)) {
            this.setState({ counts: nextProps.counts });
        }
    },

    handleChange: function handleChange(e) {
        this.setState({ counts: update(this.state.counts, _defineProperty({}, _enums.DIETS[e.target.name], { $set: parseInt(e.target.value) })) });
    },

    cancel: function cancel() {
        this.setState({ counts: this.props.counts });
    },

    getCounts: function getCounts() {
        return this.state.counts;
    },

    render: function render() {
        var counts = this.state.counts;
        var edit = this.props.edit;

        return React.createElement(
            'div',
            { className: 'calendar-cell', style: { width: _enums.cellWidth + 'px', height: _enums.cellHeight + 'px' } },
            edit && React.createElement('input', { type: 'number', min: '0', name: 'NONE_DIET', value: counts[_enums.DIETS.NONE_DIET], onChange: this.handleChange }),
            !edit && counts[_enums.DIETS.NONE_DIET]
        );
    }
});

module.exports = Meal;