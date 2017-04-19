const React = require('react');
const actions = require('core/actions');
const UserMenu = require('core/user/userMenu');
const Calendar = require('core/calendar/calendar');
const Stats = require('core/stats/stats');
const Guests = require('core/guests/guests');
const Settings = require('core/settings/settings');

let Page = React.createClass({
    getCurrentPage: function() {
        if (this.props.page == 'calendar') return Calendar;
        else if (this.props.page == 'stats') return Stats;
        else if (this.props.page == 'guests') return Guests;
        else if (this.props.page == 'settings') return Settings;
        else return null;
    },

    componentDidMount: function() {
        this.props.context.executeAction(actions.loadReservations);
        this.props.context.executeAction(actions.loadGuests);
        this.props.context.executeAction(actions.loadEvents);
    },

    render: function() {
        let CurrentPage = this.getCurrentPage();
        return (
            <div className="page">
                <UserMenu context={this.props.context} />
                {CurrentPage && <CurrentPage context={this.props.context} />}
            </div>
        );
    }
});

module.exports = Page;
