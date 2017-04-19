const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const moment = require('moment');
require('moment/locale/sk');
import {getDatesRange, diffDays} from 'core/utils/utils';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {cellWidth, cellHeight, headHeight, monthHeight, DAY_FORMAT} from 'core/enums';
import CalendarHeader from 'core/calendar/calendarHeader';
const cx = require('classnames');
import Modal from 'react-bootstrap/lib/Modal';
import GuestDetail from 'core/guests/guestDetail';
import actions from 'core/actions';

let GuestsList = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: null,
            saving: false,
            show: false
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props);
    },

    startEditing: function(guest) {
        this.setState({edit: guest, show: true});
    },

    close: function() {
        this.setState({show: false});
    },

    save: function() {
        this.setState({saving: true});
        let guest = this.refs['guest-' + this.state.edit.id].getGuest();
        let payload = {
            guest: guest
        };
        this.props.context.executeAction(actions.editGuest, payload);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps));
        }
    },

    render: function() {
        let {edit, show} = this.state;
        let guests = this.props.guests;
        let guestModal = (
            <Modal dialogClassName="guest-details-modal" bsSize="lg" show={show} onHide={this.close}>
                <Modal.Header closeButton />
                <Modal.Body>
                    {edit &&
                        <GuestDetail
                            ref={'guest-' + edit.id}
                            context={this.props.context}
                            guest={edit} />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.save}>{trans('SAVE')}</Button>
                    <Button onClick={this.close}>{trans('CLOSE')}</Button>
                </Modal.Footer>
            </Modal>
        );
        return (
            <div className="guests-list sub-section">
                <table className={cx('guests-list-table', 'sub-section-table')}>
                    <thead>
                        <tr>
                            <td></td>
                            <td>{trans('NAME_PREFIX')}</td>
                            <td>{trans('NAME')}</td>
                            <td>{trans('SURNAME')}</td>
                            <td>{trans('NAME_SUFFIX')}</td>
                            <td>{trans('STREET')}</td>
                            <td>{trans('NUMBER')}</td>
                            <td>{trans('CITY')}</td>
                            <td>{trans('PHONE')}</td>
                            <td>{trans('VISITS')}</td>
                            <td>{trans('NOTES')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(guests, (guest, index) => {
                            let visitsCount = guest.visits.length;
                            let visitsPopup = null;
                            if (visitsCount > 0) {
                                visitsPopup = (
                                    <Popover key={'visits-of-' + guest.id} id={'visits-list-' + guest.id} bsClass={cx('visits-popup', 'popover')}>
                                        {_.map(guest.visits, (visit, i) => {
                                            return <div key={'visit-date-' + i}>{visit.dateFrom.format('D.M.YYYY')} - {visit.dateTo.format('D.M.YYYY')}</div>
                                        })}
                                    </Popover>
                                );
                            }
                            return (
                                <tr key={'guest-' + guest.id} onDoubleClick={() => this.startEditing(guest)}>
                                    <td className="keep-right">{index + 1}</td>
                                    <td>{guest.namePrefix}</td>
                                    <td>{guest.name}</td>
                                    <td>{guest.surname}</td>
                                    <td>{guest.nameSuffix}</td>
                                    <td>{guest.addressStreet}</td>
                                    <td>{guest.addressNumber}</td>
                                    <td>{guest.addressCity}</td>
                                    <td>{guest.phone}</td>
                                    <td className="keep-center">{visitsCount > 0 &&
                                        <OverlayTrigger trigger="click" placement="right" overlay={visitsPopup} rootClose arrowOffsetLeft="30">
                                            <a className="visits-count">{visitsCount}</a>
                                        </OverlayTrigger>
                                        }</td>
                                    <td>{!guest.recommended &&
                                        <Glyphicon glyph="exclamation-sign" alt={trans('NOT_RECOMMENDED')} />}{guest.note}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {guestModal}
            </div>
        );
    }
});

module.exports = GuestsList;
