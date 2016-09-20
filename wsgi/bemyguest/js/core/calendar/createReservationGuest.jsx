const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
const cx = require('classnames');

let CreateReservationGuest = React.createClass({
    getInitialState: function() {
        return {
            namePrefix: '',
            name: '',
            surname: '',
            nameSuffix: '',
            addressStreet: '',
            addressNumber: '',
            addressCity: '',
            phone: '',
            showDetails: false,
            extraBed: this.props.extraBed
        };
    },

    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },

    toggleDetails: function() {
        this.setState({showDetails: !this.state.showDetails});
    },

    getGuest: function() {
        if (!(this.state.name && this.state.surname)) return null;
        return {
            namePrefix: this.state.namePrefix,
            name: this.state.name,
            surname: this.state.surname,
            nameSuffix: this.state.nameSuffix,
            addressStreet: this.state.addressStreet,
            addressNumber: this.state.addressNumber,
            addressCity: this.state.addressCity,
            phone: this.state.phone
        };
    },

    clearData: function() {
        this.setState(this.getInitialState());
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

module.exports = CreateReservationGuest;
