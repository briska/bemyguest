'use strict';

var React = require('react');
var actions = require('core/actions');
var UserMenu = require('core/user/userMenu');
var Calendar = require('core/calendar/calendar');
var Stats = require('core/stats/stats');

var Page = React.createClass({
    displayName: 'Page',

    getCurrentPage: function getCurrentPage() {
        if (this.props.page == 'calendar') return Calendar;else if (this.props.page == 'stats') return Stats;else return null;
    },

    componentDidMount: function componentDidMount() {
        this.props.context.executeAction(actions.loadUser);
    },

    render: function render() {
        var CurrentPage = this.getCurrentPage();
        return React.createElement(
            'div',
            { className: 'page' },
            React.createElement(UserMenu, { context: this.props.context }),
            CurrentPage && React.createElement(CurrentPage, { context: this.props.context })
        );
    }
});

module.exports = Page;