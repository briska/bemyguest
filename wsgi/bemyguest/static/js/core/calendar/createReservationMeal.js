'use strict';

var _enums = require('core/enums');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var update = require('react-addons-update');


var CreateReservationMeal = React.createClass({
    displayName: 'CreateReservationMeal',

    getInitialState: function getInitialState() {
        return {
            counts: [this.props.count, 0, 0, 0]
        };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.count != this.props.count && this.state.counts[_enums.DIETS.NONE_DIET] == this.props.count) {
            this.setState({ counts: update(this.state.counts, _defineProperty({}, _enums.DIETS.NONE_DIET, { $set: nextProps.count })) });
        }
    },

    handleChange: function handleChange(e) {
        this.setState({ counts: update(this.state.counts, _defineProperty({}, _enums.DIETS[e.target.name], { $set: e.target.value })) });
    },

    getCounts: function getCounts() {
        return this.state.counts;
    },

    render: function render() {
        var counts = this.state.counts;

        return React.createElement(
            'div',
            { className: 'calendar-cell', style: { width: _enums.cellWidth + 'px', height: _enums.cellHeight + 'px' } },
            React.createElement('input', { type: 'number', name: 'NONE_DIET', value: counts[_enums.DIETS.NONE_DIET], onChange: this.handleChange })
        );
    }
});

module.exports = CreateReservationMeal;