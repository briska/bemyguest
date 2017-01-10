const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
const GuestsStore = require('core/guestsStore');
import Modal from 'react-bootstrap/lib/Modal';
import GuestDetail from 'core/guests/guestDetail';
import actions from 'core/actions';
import Button from 'react-bootstrap/lib/Button';
const moment = require('moment');
require('moment/locale/sk');

let Guest = React.createClass({
    getStateFromSource: function(guest) {
        if (guest) {
            return {
                id: guest.id,
                namePrefix: guest.namePrefix,
                name: guest.name,
                surname: guest.surname,
                nameSuffix: guest.nameSuffix,
                addressStreet: guest.addressStreet,
                addressNumber: guest.addressNumber,
                addressCity: guest.addressCity,
                phone: guest.phone,
                recommended: guest.recommended,
                note: guest.note,
                showDetails: false,
                guestSuggestions: [],
                show: false,
                saving: false
            };
        }
        return {
            id: null,
            namePrefix: '',
            name: '',
            surname: '',
            nameSuffix: '',
            addressStreet: '',
            addressNumber: '',
            addressCity: '',
            phone: '',
            recommended: true,
            note: '',
            showDetails: false,
            guestSuggestions: [],
            show: false,
            saving: false
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props.guest);
    },

    handleChange: function(e, callback) {
        this.setState({[e.target.name]: e.target.value}, callback);
    },

    toggleDetails: function() {
        this.setState({showDetails: !this.state.showDetails});
    },

    clearData: function() {
        this.setState(this.getStateFromSource(null));
    },

    getGuest: function() {
        return {
            id: this.state.id,
            namePrefix: this.state.namePrefix,
            name: this.state.name,
            surname: this.state.surname,
            nameSuffix: this.state.nameSuffix,
            addressStreet: this.state.addressStreet,
            addressNumber: this.state.addressNumber,
            addressCity: this.state.addressCity,
            phone: this.state.phone,
            recommended: this.state.recommended,
            note: this.state.note,
        };
    },

    getGuestSuggestions: function() {
        let suggestions = this.props.context.getStore(GuestsStore).getGuestsByMatch(this.state.name, this.state.surname);
        this.setState({guestSuggestions: suggestions});
    },

    applySuggestion: function(guestSuggestion) {
        this.setState(this.getStateFromSource(guestSuggestion));
    },

    openEditUser: function() {
        this.setState({show: true});
    },

    close: function() {
        this.setState({show: false});
    },

    save: function() {
        this.setState({saving: true});
        let guest = this.refs['guest-' + this.state.id].getGuest();
        let payload = {
            guest: guest
        };
        this.props.context.executeAction(actions.editGuest, payload);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps.guest));
        }
    },

    render: function() {
        let {id, namePrefix, name, surname, nameSuffix, addressStreet, addressNumber, addressCity, phone, showDetails, guestSuggestions, show} = this.state;
        let {extraBed, noEdit, roomReservationFirstDay, roomReservationId} = this.props;
        let hasId = id != null;
        let guestName = "";
        let guestAddress = "";
        let guestDetails = "";
        let guestModal = null;
        if (hasId) {
            guestName = _.filter([namePrefix, name, surname, nameSuffix], null).join(' ');
            guestAddress = _.filter([addressStreet, addressNumber, addressCity], null).join(' ');
            guestDetails = (guestAddress ? (phone ? guestAddress + ', ' + phone : guestAddress) : phone);
            let currentGuest = this.props.context.getStore(GuestsStore).getGuest(id);
            guestModal = (
                <Modal dialogClassName="guest-details-modal" bsSize="lg" show={show} onHide={this.close}>
                    <Modal.Header closeButton />
                    <Modal.Body>
                        <GuestDetail
                            ref={'guest-' + currentGuest.id}
                            context={this.props.context}
                            guest={currentGuest} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.save}>{trans('SAVE')}</Button>
                        <Button onClick={this.close}>{trans('CLOSE')}</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        return (
            <div className={cx('guest', extraBed ? 'extra-bed' : '')}>
                {hasId &&
                    <div className="known-guest-info">
                        <Glyphicon glyph="user" />
                        <span className="known-info">{guestName + (guestDetails ? ' (' + guestDetails + ')' : '')}</span>
                        {!noEdit &&
                            <Glyphicon glyph="pencil" onClick={this.openEditUser} />}
                        <Glyphicon glyph="remove" onClick={this.clearData} />
                    </div>}
                {!hasId &&
                    <div className="guest-name">
                        <Glyphicon glyph="user" />
                        <input type="text" name="namePrefix" value={namePrefix} placeholder={trans('NAME_PREFIX')} onChange={this.handleChange} />
                        <input type="text" name="name" value={name} placeholder={trans('NAME')} onChange={(e) => {this.handleChange(e, this.getGuestSuggestions)}} autoComplete="off" />
                        <input type="text" name="surname" value={surname} placeholder={trans('SURNAME')} onChange={(e) => {this.handleChange(e, this.getGuestSuggestions)}} autoComplete="off" />
                        <input type="text" name="nameSuffix" value={nameSuffix} placeholder={trans('NAME_SUFFIX')} onChange={this.handleChange} />
                        <Glyphicon glyph={showDetails ? 'chevron-up' : 'chevron-down'} onClick={this.toggleDetails} />
                        <Glyphicon glyph="remove" onClick={this.clearData} />
                    </div>}
                {showDetails && !hasId &&
                    <div className="guest-address">
                        <Glyphicon glyph="home" />
                        <input type="text" name="addressStreet" value={addressStreet} placeholder={trans('STREET')} onChange={this.handleChange} />
                        <input type="text" name="addressNumber" value={addressNumber} placeholder={trans('NUMBER')} onChange={this.handleChange} />
                        <input type="text" name="addressCity" value={addressCity} placeholder={trans('CITY')} onChange={this.handleChange} />
                    </div>}
                {showDetails && !hasId &&
                    <div className="guest-phone">
                        <Glyphicon glyph="phone-alt" />
                        <input type="text" name="phone" value={phone} placeholder={trans('PHONE')} onChange={this.handleChange} />
                    </div>}
                {guestSuggestions.length > 0 && !hasId &&
                    <div className="guest-suggestions">
                        {_.map(guestSuggestions, (suggestion, i) => {
                            let visits = _.filter(suggestion.visits, visit => visit.id != (roomReservationId || 0));
                            let shortTime = visits.length > 0 && roomReservationFirstDay.diff(visits[0].dateTo, 'months') < 6;
                            let guestName = _.filter([suggestion.namePrefix, suggestion.name, suggestion.surname, suggestion.nameSuffix], null).join(' ');
                            let guestAddress = _.filter([suggestion.addressStreet, suggestion.addressNumber, suggestion.addressCity], null).join(' ');
                            let guestDetails = (guestAddress ? (suggestion.phone ? guestAddress + ', ' + suggestion.phone : guestAddress) : suggestion.phone);
                            return (
                                <div key={'suggestion-' + suggestion.id} className="suggestion-row" onClick={() => this.applySuggestion(suggestion)}>
                                    <span className="guest-info">
                                        {guestName + (guestDetails ? ' (' + guestDetails + ')' : '')}
                                    </span>
                                    {!suggestion.recommended &&
                                        <Glyphicon glyph="exclamation-sign" alt={trans('NOT_RECOMMENDED')} />}
                                    {shortTime &&
                                        <Glyphicon glyph="time" />}
                                    {shortTime &&
                                        <span className="last-visit">
                                            {visits[0].dateFrom.format('D. MMMM YYYY')} - {visits[0].dateTo.format('D. MMMM YYYY')}
                                        </span>}
                                </div>
                            );
                        })}
                    </div>}
                {guestModal}
            </div>
        );
    }
});

module.exports = Guest;
