const _ = require('lodash');
const React = require('react');
const xhr = require('core/utils/xhr');
const trans = require('core/utils/trans');
const cx = require('classnames');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const actions = require('core/calendar/actions');
const ReservationsStore = require('core/calendar/reservationsStore');
const Spinner = require('core/utils/spinner');

let Calendar = React.createClass({
    loadReservations: function() {
        this.props.context.executeAction(actions.loadReservations);
    },
    
    componentDidMount: function() {
        this.loadReservations();
    },
    
    render: function() {
        return (
            <div className="calendar">
                <h1>{trans('CALENDAR')}</h1>
                {_.map(this.props.reservations, (reservation) => {
                    return (
                        <div key={reservation.id}>{reservation.contact_name}, {reservation.contact_mail}, {reservation.contact_phone}</div>
                    );
                })}
            </div>
        );
    }
});

Calendar = connectToStores(Calendar, [ReservationsStore], (context, props) => ({
    reservations: context.getStore(ReservationsStore).getReservations()
}));

module.exports = provideContext(Calendar);
