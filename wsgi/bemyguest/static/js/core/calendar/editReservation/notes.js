'use strict';

var _reactBootstrap = require('react-bootstrap');

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


var Notes = React.createClass({
    displayName: 'Notes',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            notes: this.props.notes
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, notes: this.props.notes });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'notes': this.state.notes
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
        var notes = _state.notes;

        return React.createElement(
            'div',
            { className: 'notes form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'label',
                { className: 'block' },
                trans('NOTES')
            ),
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
            edit && React.createElement(_reactTextareaAutosize2.default, { value: notes, name: 'notes', onChange: this.handleChange }),
            !edit && notes && React.createElement(
                'div',
                { className: 'notes-box' },
                (0, _reactNl2br2.default)(notes)
            )
        );
    }
});

module.exports = Notes;