'use strict';

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var actions = require('core/actions');
var ReservationsStore = require('core/calendar/reservationsStore');

var Calendar = React.createClass({
    displayName: 'Calendar',

    loadReservations: function loadReservations() {
        this.props.context.executeAction(actions.loadReservations);
    },

    componentDidMount: function componentDidMount() {
        this.loadReservations();
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'calendar' },
            React.createElement(
                'h1',
                null,
                trans('CALENDAR')
            ),
            React.createElement(
                'button',
                { onClick: this.loadReservations },
                'load'
            ),
            _.map(this.props.reservations, function (reservation) {
                return React.createElement(
                    'div',
                    { key: reservation.id },
                    reservation.contact_name,
                    ', ',
                    reservation.contact_mail,
                    ', ',
                    reservation.contact_phone
                );
            })
        );
    }
});

Calendar = connectToStores(Calendar, [ReservationsStore], function (context, props) {
    return {
        reservations: context.getStore(ReservationsStore).getReservations()
    };
});

module.exports = provideContext(Calendar);