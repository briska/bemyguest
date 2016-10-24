const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
const GuestsStore = require('core/guestsStore');

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
                extraBed: this.props.extraBed,
                guestSuggestions: []
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
            extraBed: this.props.extraBed,
            guestSuggestions: []
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
        console.log('editing user');
    },

    render: function() {
        let {id, namePrefix, name, surname, nameSuffix, addressStreet, addressNumber, addressCity, phone, showDetails, extraBed, guestSuggestions} = this.state;
        let hasId = id != null;
        let guestName = "";
        let guestAddress = "";
        let guestDetails = "";
        if (hasId) {
            guestName = _.filter([namePrefix, name, surname, nameSuffix], null).join(' ');
            guestAddress = _.filter([addressStreet, addressNumber, addressCity], null).join(' ');
            guestDetails = (guestAddress ? (phone ? guestAddress + ', ' + phone : guestAddress) : phone);
        }
        return (
            <div className={cx('guest', extraBed ? 'extra-bed' : '')}>
                {hasId &&
                    <div className="known-guest-info">
                        <Glyphicon glyph="user" />
                        {guestName + (guestDetails ? ' (' + guestDetails + ')' : '')}
                        <Glyphicon glyph="pencil" onClick={this.openEditUser} />
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
                            let guestName = _.filter([suggestion.namePrefix, suggestion.name, suggestion.surname, suggestion.nameSuffix], null).join(' ');
                            let guestAddress = _.filter([suggestion.addressStreet, suggestion.addressNumber, suggestion.addressCity], null).join(' ');
                            let guestDetails = (guestAddress ? (suggestion.phone ? guestAddress + ', ' + suggestion.phone : guestAddress) : suggestion.phone);
                            return (
                                <div key={'suggestion-' + suggestion.id} className="suggestion-row" onClick={() => this.applySuggestion(suggestion)}>
                                    {!suggestion.recommended &&
                                        <Glyphicon glyph="exclamation-sign" alt={trans('NOT_RECOMMENDED')} />}
                                    {guestName + (guestDetails ? ' (' + guestDetails + ')' : '')}
                                </div>
                            );
                        })}
                    </div>}
            </div>
        );
    }
});

module.exports = Guest;
