const React = require('react');
const trans = require('core/utils/trans');
const provideContext = require('fluxible-addons-react/provideContext');

let Stats = React.createClass({
    render: function() {
        return (
            <div className="stats">
                <h1>{trans('STATS')}</h1>
            </div>
        );
    }
});

module.exports = provideContext(Stats);
