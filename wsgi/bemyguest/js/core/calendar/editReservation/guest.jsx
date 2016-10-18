const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

let Guest = React.createClass({
    getStateFromSource: function(guest) {
        if (guest) {
            return {
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
                extraBed: this.props.extraBed
            };
        }
        return {
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
            extraBed: this.props.extraBed
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props.guest);
    },

    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },

    toggleDetails: function() {
        this.setState({showDetails: !this.state.showDetails});
    },

    clearData: function() {
        this.setState(this.getStateFromSource(null));
    },

    getGuest: function() {
        return {
            id: this.props.guest ? this.props.guest.id : null,
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

    render: function() {
        let {namePrefix, name, surname, nameSuffix, addressStreet, addressNumber, addressCity, phone, showDetails, extraBed} = this.state;
        return (
            <div className={cx('guest', extraBed ? 'extra-bed' : '')}>
                <div className="guest-name">
                    <Glyphicon glyph="user" />
                    <input type="text" name="namePrefix" value={namePrefix} placeholder={trans('NAME_PREFIX')} onChange={this.handleChange} />
                    <input type="text" name="name" value={name} placeholder={trans('NAME')} onChange={this.handleChange} />
                    <input type="text" name="surname" value={surname} placeholder={trans('SURNAME')} onChange={this.handleChange} />
                    <input type="text" name="nameSuffix" value={nameSuffix} placeholder={trans('NAME_SUFFIX')} onChange={this.handleChange} />
                    <Glyphicon glyph={showDetails ? 'chevron-up' : 'chevron-down'} onClick={this.toggleDetails} />
                    <Glyphicon glyph="trash" onClick={this.clearData} />
                </div>
                {showDetails &&
                    <div className="guest-address">
                        <Glyphicon glyph="home" />
                        <input type="text" name="addressStreet" value={addressStreet} placeholder={trans('STREET')} onChange={this.handleChange} />
                        <input type="text" name="addressNumber" value={addressNumber} placeholder={trans('NUMBER')} onChange={this.handleChange} />
                        <input type="text" name="addressCity" value={addressCity} placeholder={trans('CITY')} onChange={this.handleChange} />
                    </div>}
                {showDetails &&
                    <div className="guest-phone">
                        <Glyphicon glyph="phone-alt" />
                        <input type="text" name="phone" value={phone} placeholder={trans('PHONE')} onChange={this.handleChange} />
                    </div>}
            </div>
        );
    }
});

module.exports = Guest;
