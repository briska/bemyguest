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


var MailCommunication = React.createClass({
    displayName: 'MailCommunication',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            mailCommunication: this.props.mailCommunication
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, mailCommunication: this.props.mailCommunication });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'mailCommunication': this.state.mailCommunication
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
        var mailCommunication = _state.mailCommunication;

        return React.createElement(
            'div',
            { className: 'mail-communication form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'label',
                { className: 'block' },
                trans('MAIL_COMMUNICATION')
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
            edit && React.createElement('textarea', { value: mailCommunication, name: 'mailCommunication', onChange: this.handleChange }),
            !edit && mailCommunication && React.createElement(
                'div',
                { className: 'mail-communication-box' },
                (0, _reactNl2br2.default)(mailCommunication)
            )
        );
    }
});

module.exports = MailCommunication;