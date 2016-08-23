'use strict';

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');


var CreateReservationGuest = React.createClass({
    displayName: 'CreateReservationGuest',

    getInitialState: function getInitialState() {
        return {
            namePrefix: '',
            name: '',
            surname: '',
            nameSuffix: '',
            addressStreet: '',
            addressNumber: '',
            addressCity: '',
            phone: '',
            showDetails: false
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    toggleDetails: function toggleDetails() {
        this.setState({ showDetails: !this.state.showDetails });
    },

    getGuest: function getGuest() {
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

    render: function render() {
        var _state = this.state;
        var namePrefix = _state.namePrefix;
        var name = _state.name;
        var surname = _state.surname;
        var nameSuffix = _state.nameSuffix;
        var addressStreet = _state.addressStreet;
        var addressNumber = _state.addressNumber;
        var addressCity = _state.addressCity;
        var phone = _state.phone;
        var showDetails = _state.showDetails;

        return React.createElement(
            'div',
            { className: 'guest' },
            React.createElement(
                'div',
                { className: 'guest-name' },
                React.createElement(_Glyphicon2.default, { glyph: 'user' }),
                React.createElement('input', { type: 'text', name: 'namePrefix', value: namePrefix, placeholder: trans('NAME_PREFIX'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', name: 'name', value: name, placeholder: trans('NAME'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', name: 'surname', value: surname, placeholder: trans('SURNAME'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', name: 'nameSuffix', value: nameSuffix, placeholder: trans('NAME_SUFFIX'), onChange: this.handleChange }),
                React.createElement(_Glyphicon2.default, { glyph: showDetails ? 'minus' : 'plus', onClick: this.toggleDetails })
            ),
            showDetails && React.createElement(
                'div',
                { className: 'guest-address' },
                React.createElement(_Glyphicon2.default, { glyph: 'home' }),
                React.createElement('input', { type: 'text', name: 'addressStreet', value: addressStreet, placeholder: trans('STREET'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', name: 'addressNumber', value: addressNumber, placeholder: trans('NUMBER'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', name: 'addressCity', value: addressCity, placeholder: trans('CITY'), onChange: this.handleChange })
            ),
            showDetails && React.createElement(
                'div',
                { className: 'guest-phone' },
                React.createElement(_Glyphicon2.default, { glyph: 'phone-alt' }),
                React.createElement('input', { type: 'text', name: 'phone', value: phone, placeholder: trans('PHONE'), onChange: this.handleChange })
            )
        );
    }
});

module.exports = CreateReservationGuest;