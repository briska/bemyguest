const React = require('react');
const trans = require('core/utils/trans');
const connectToStores = require('fluxible-addons-react/connectToStores');
import UserStore from 'core/user/userStore';
import Meals from 'core/stats/meals';
import RoomOccupation from 'core/stats/roomOccupation';
import Finances from 'core/stats/finances';

let Stats = React.createClass({
    render: function() {
        let context = this.props.context;
        return (
            <div className="stats">
                <h1>{trans('STATS')}</h1>
                <Meals context={context} />
                <RoomOccupation context={context} />
                {this.props.user.canEdit &&
                    <Finances context={context} />}
            </div>
        );
    }
});

Stats = connectToStores(Stats, [UserStore], (context, props) => ({
    user: context.getStore(UserStore).getUser(),
}));

module.exports = Stats;
