const _ = require('lodash');
const React = require('react');
const xhr = require('core/utils/xhr');
const trans = require('core/utils/trans');
const cx = require('classnames');
const provideContext = require('fluxible-addons-react/provideContext');
const Spinner = require('core/utils/spinner');

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
