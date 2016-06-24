'use strict';

var React = require('react');
var trans = require('core/utils/trans');
var provideContext = require('fluxible-addons-react/provideContext');

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