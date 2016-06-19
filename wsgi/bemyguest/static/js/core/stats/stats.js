'use strict';

var _ = require('lodash');
var React = require('react');
var xhr = require('core/utils/xhr');
var trans = require('core/utils/trans');
var cx = require('classnames');
var provideContext = require('fluxible-addons-react/provideContext');
var Spinner = require('core/utils/spinner');

var Stats = React.createClass({
    displayName: 'Stats',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'stats' },
            React.createElement(
                'h1',
                null,
                trans('STATS')
            )
        );
    }
});

module.exports = provideContext(Stats);