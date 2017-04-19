const React = require('react');
import connectToStores from 'fluxible-addons-react/connectToStores';
const trans = require('core/utils/trans');
import GuestsList from 'core/guests/guestsList';
import UserStore from 'core/user/userStore';
import GuestsStore from 'core/guestsStore';

let Guests = React.createClass({
    render: function() {
        const {context, guests} = this.props;

        return (
            <div className="guests">
                <h1>{trans('GUESTS')} <span className='guests-count'>({guests.length})</span></h1>
                {this.props.user.canEdit &&
                    <GuestsList context={context} guests={guests} />}
            </div>
        );
    }
});

Guests = connectToStores(Guests, [GuestsStore, UserStore], (context, props) => ({
    user: context.getStore(UserStore).getUser(),
    guests: context.getStore(GuestsStore).getGuests()
}));

module.exports = Guests;
