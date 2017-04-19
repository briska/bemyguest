const React = require('react');
const trans = require('core/utils/trans');
const connectToStores = require('fluxible-addons-react/connectToStores');
import UserStore from 'core/user/userStore';
import EventsList from 'core/settings/eventsList';

let Settings = React.createClass({
    render: function() {
        let context = this.props.context;
        return (
            <div className="settings">
                <h1>{trans('SETTINGS')}</h1>
                {this.props.user.canEdit && 
                    <EventsList context={context} />}
            </div>
        );
    }
});

Settings = connectToStores(Settings, [UserStore], (context, props) => ({
    user: context.getStore(UserStore).getUser(),
}));

module.exports = Settings;
