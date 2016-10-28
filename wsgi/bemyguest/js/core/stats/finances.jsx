const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const connectToStores = require('fluxible-addons-react/connectToStores');
const ReservationsStore = require('core/calendar/reservationsStore');
import RoomsStore from 'core/roomsStore';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import actions from 'core/actions';
const moment = require('moment');
require('moment/locale/sk');
import CalendarHeader from 'core/calendar/calendarHeader';
const xhr = require('core/utils/xhr');
import ReservationDetails from 'core/calendar/ReservationDetails';
const cx = require('classnames');

let Finances = React.createClass({

    getInitialState: function(){
        return {

        };
    },

    showFullDetails: function(reservationId) {
        this.refs['reservationDetails-' + reservationId].open();
    },

    render: function() {
        let {reservations, context} = this.props;
        return (
            <div className="finances stats-section">
                <h2>{trans('FINANCES')}</h2>
                <table className="finances-table">
                    <thead>
                        <tr>
                            <td>{trans('RESERVATION')}</td>
                            <td>{trans('CONTACT')}</td>
                            <td>{trans('FROM')}</td>
                            <td>{trans('TO')}</td>
                            <td>{trans('PRICE_PAYED')}</td>
                            <td className="keep-center" colSpan="2">{trans('COSTS')}</td>
                            <td>{trans('DIFFERENCE')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(reservations, (reservation, i) => {
                            let priceDiff = reservation.pricePayed - (reservation.priceHousing + reservation.priceSpiritual);
                            let sign = "";
                            let diffClass = "";
                            if (priceDiff > 0) {
                                sign = "+";
                                diffClass = "diff-positive";
                            } else if (priceDiff < 0) {
                                sign = "-";
                                diffClass = "diff-negative";
                            }
                            return (
                                <tr key={'reservation-' + reservation.id} onDoubleClick={() => this.showFullDetails(reservation.id)}>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.contactName}</td>
                                    <td>{reservation.dateFrom.format('D.M.YYYY')}</td>
                                    <td>{reservation.dateTo.format('D.M.YYYY')}</td>
                                    <td className="keep-right">{reservation.pricePayed} €</td>
                                    <td className="keep-right">{reservation.priceHousing} + {reservation.priceSpiritual} =</td>
                                    <td className="keep-right">{reservation.priceHousing + reservation.priceSpiritual} €</td>
                                    <td className={cx('keep-right', diffClass)}>{sign} {Math.abs(priceDiff)} €</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {_.map(reservations, (reservation, i) => {
                    return (
                        <ReservationDetails
                            key={'reservation-details-' + reservation.id}
                            ref={'reservationDetails-' + reservation.id}
                            context={context}
                            reservation={reservation} />
                    );
                })}
            </div>
        );
    }
});

Finances = connectToStores(Finances, [ReservationsStore, RoomsStore], (context, props) => ({
    reservations: context.getStore(ReservationsStore).getReservations(),
    rooms: context.getStore(RoomsStore).getRooms()
}));

module.exports = Finances;
