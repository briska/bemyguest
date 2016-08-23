'use strict';

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _reactNl2br = require('react-nl2br');

var _reactNl2br2 = _interopRequireDefault(_reactNl2br);

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');


var Contact = React.createClass({
    displayName: 'Contact',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            contactName: this.props.contactName,
            contactMail: this.props.contactMail,
            contactPhone: this.props.contactPhone
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({
            edit: false,
            contactName: this.props.contactName,
            contactMail: this.props.contactMail,
            contactPhone: this.props.contactPhone
        });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'contact': {
                    'contactName': this.state.contactName,
                    'contactMail': this.state.contactMail,
                    'contactPhone': this.state.contactPhone
                }
            }
        };
        this.props.context.executeAction(_actions2.default.editReservation, payload);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.saving) {
            this.setState({ saving: false, edit: false });
        }
    },

    render: function render() {
        var _state = this.state;
        var edit = _state.edit;
        var saving = _state.saving;
        var contactName = _state.contactName;
        var contactMail = _state.contactMail;
        var contactPhone = _state.contactPhone;

        var contact = _.filter([contactName, contactMail, contactPhone], null).join(', ');
        return React.createElement(
            'div',
            { className: 'contact form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'label',
                { className: 'inline' },
                trans('CONTACT'),
                ':'
            ),
            edit && !saving && React.createElement(
                _Button2.default,
                { className: 'form-group-button cancel', onClick: this.cancel },
                React.createElement(_Glyphicon2.default, { glyph: 'remove' })
            ),
            edit && !saving && React.createElement(
                _Button2.default,
                { bsStyle: 'success', className: 'form-group-button save', onClick: this.save },
                React.createElement(_Glyphicon2.default, { glyph: 'ok' })
            ),
            edit && React.createElement(
                'span',
                { className: 'edit-contact' },
                React.createElement('input', { type: 'text', value: contactName, name: 'contactName', placeholder: trans('CONTACT_NAME'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', value: contactMail, name: 'contactMail', placeholder: trans('CONTACT_MAIL'), onChange: this.handleChange }),
                React.createElement('input', { type: 'text', value: contactPhone, name: 'contactPhone', placeholder: trans('CONTACT_PHONE'), onChange: this.handleChange })
            ),
            !edit && contact && React.createElement(
                'span',
                { className: 'contact-box' },
                contact
            )
        );
    }
});

module.exports = Contact;