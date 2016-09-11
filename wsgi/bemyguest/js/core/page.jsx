const React = require('react');
const actions = require('core/actions');
const UserMenu = require('core/user/userMenu');
const Calendar = require('core/calendar/calendar');
const Stats = require('core/stats/stats');

let Page = React.createClass({
    getCurrentPage: function() {
        if (this.props.page == 'calendar') return Calendar;
        else if (this.props.page == 'stats') return Stats;
        else return null;
    },
    
    componentDidMount: function() {
        this.props.context.executeAction(actions.loadUser);
        this.props.context.executeAction(actions.loadFeasts);
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
