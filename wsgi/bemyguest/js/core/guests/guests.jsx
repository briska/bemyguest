const React = require('react');
const trans = require('core/utils/trans');
import GuestsList from 'core/guests/guestsList';

let Guests = React.createClass({
    render: function() {
        return (
            <div className="guests">
                <h1>{trans('GUESTS')}</h1>
                <GuestsList context={this.props.context} />
            </div>
        );
    }
});

module.exports = Guests;
