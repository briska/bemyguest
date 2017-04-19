const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Textarea from 'react-textarea-autosize';

let GuestDetail = React.createClass({
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

    handleComboboxChange: function(e) {
        let componentName = e.target.name;
        let previousValue = this.state[componentName];
        this.setState({[componentName]: !previousValue});
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
        let {namePrefix, name, surname, nameSuffix, addressStreet, addressNumber, addressCity, phone, recommended, note, showDetails, extraBed} = this.state;
        return (
            <div className="guest-detail">
                <div className="form-row">
                    <Glyphicon className={cx('col-md-1', 'form-label')} glyph="user" />
                    <label className={cx('col-md-2', 'form-label')} htmlFor="namePrefix">{trans('NAME_PREFIX')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="namePrefix" name="namePrefix" value={namePrefix} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="name">{trans('NAME')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="name" name="name" value={name} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="surname">{trans('SURNAME')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="surname" name="surname" value={surname} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="nameSuffix">{trans('NAME_SUFFIX')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="nameSuffix" name="nameSuffix" value={nameSuffix} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <Glyphicon className={cx('col-md-1', 'form-label')} glyph="home" />
                    <label className={cx('col-md-2', 'form-label')} htmlFor="addressStreet">{trans('STREET')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="addressStreet" name="addressStreet" value={addressStreet} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="addressNumber">{trans('NUMBER')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="addressNumber" name="addressNumber" value={addressNumber} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="addressCity">{trans('CITY')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="addressCity" name="addressCity" value={addressCity} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <Glyphicon className={cx('col-md-1', 'form-label')} glyph="phone-alt" />
                    <label className={cx('col-md-2', 'form-label')} htmlFor="phone">{trans('PHONE')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="phone" name="phone" value={phone} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="col-md-offset-3  col-md-9">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" id="recommended" name="recommended" checked={!recommended} onChange={this.handleComboboxChange} />
                                {trans('NOT_RECOMMENDED')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="note">{trans('NOTES')}</label>
                    <div className="col-md-7">
                        <Textarea className="form-element" id="note" value={note} name="note" onChange={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GuestDetail;
