const React = require('react');
const trans = require('core/utils/trans');
import EventsList from 'core/settings/eventsList';

let Settings = React.createClass({
    render: function() {
        let context = this.props.context;
        return (
            <div className="settings">
                <h1>{trans('SETTINGS')}</h1>
                <EventsList context={context} />
            </div>
        );
    }
});

module.exports = Settings;
