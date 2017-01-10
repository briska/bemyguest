const React = require('react');
import connectToStores from 'fluxible-addons-react/connectToStores';
const trans = require('core/utils/trans');
import GuestsList from 'core/guests/guestsList';
import GuestsStore from 'core/guestsStore';

let Guests = React.createClass({
    render: function() {
        const {context, guests} = this.props;

        return (
            <div className="guests">
                <h1>{trans('GUESTS')} <span className='guests-count'>({guests.length})</span></h1>
                <GuestsList context={context} guests={guests} />
            </div>
        );
    }
});

Guests = connectToStores(Guests, [GuestsStore], (context, props) => ({
    guests: context.getStore(GuestsStore).getGuests()
}));

module.exports = Guests;
