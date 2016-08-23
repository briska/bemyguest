'use strict';

var _Glyphicon = require('react-bootstrap/lib/Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _reactNl2br = require('react-nl2br');

var _reactNl2br2 = _interopRequireDefault(_reactNl2br);

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

var _reactTextareaAutosize = require('react-textarea-autosize');

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');


var Purpose = React.createClass({
    displayName: 'Purpose',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            purpose: this.props.purpose
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, purpose: this.props.purpose });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'purpose': this.state.purpose
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
        var purpose = _state.purpose;

        return React.createElement(
            'div',
            { className: 'purpose form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'label',
                { className: 'block' },
                trans('PURPOSE')
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
            edit && React.createElement(_reactTextareaAutosize2.default, { value: purpose, name: 'purpose', onChange: this.handleChange }),
            !edit && purpose && React.createElement(
                'div',
                { className: 'purpose-box' },
                (0, _reactNl2br2.default)(purpose)
            )
        );
    }
});

module.exports = Purpose;