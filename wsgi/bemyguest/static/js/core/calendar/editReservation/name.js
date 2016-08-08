'use strict';

var _reactBootstrap = require('react-bootstrap');

var _reactNl2br = require('react-nl2br');

var _reactNl2br2 = _interopRequireDefault(_reactNl2br);

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');


var Name = React.createClass({
    displayName: 'Name',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            name: this.props.name
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, name: this.props.name });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'name': this.state.name
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
        var name = _state.name;

        return React.createElement(
            'div',
            { className: 'name form-group', onDoubleClick: this.startEditing },
            edit && !saving && React.createElement(
                _reactBootstrap.Button,
                { className: 'form-group-button cancel', onClick: this.cancel },
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove' })
            ),
            edit && !saving && React.createElement(
                _reactBootstrap.Button,
                { bsStyle: 'success', className: 'form-group-button save', onClick: this.save },
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'ok' })
            ),
            edit && React.createElement('input', { type: 'text', value: name, name: 'name', onChange: this.handleChange }),
            !edit && React.createElement(
                'h3',
                { className: 'title' },
                name || trans('RESERVATION')
            )
        );
    }
});

module.exports = Name;