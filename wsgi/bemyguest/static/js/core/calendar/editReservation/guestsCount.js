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


var GuestsCount = React.createClass({
    displayName: 'GuestsCount',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            guestsCount: this.props.guestsCount
        };
    },

    handleChange: function handleChange(e) {
        this.setState(_defineProperty({}, e.target.name, e.target.value));
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false, guestsCount: this.props.guestsCount });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'guestsCount': this.state.guestsCount
            }
        };
        this.props.context.executeAction(_actions2.default.editReservation, payload);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.saving) {
            this.setState({ saving: false, edit: false });
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (this.state.edit && !prevState.edit) {
            this.refs.control.select();
        }
    },

    render: function render() {
        var _state = this.state;
        var edit = _state.edit;
        var saving = _state.saving;
        var guestsCount = _state.guestsCount;

        return React.createElement(
            'div',
            { className: 'guests-count form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'label',
                { className: 'inline' },
                trans('GUESTS_COUNT'),
                ':'
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
            edit && React.createElement('input', { type: 'number', value: guestsCount, name: 'guestsCount', ref: 'control', onChange: this.handleChange }),
            !edit && React.createElement(
                'span',
                null,
                guestsCount
            )
        );
    }
});

module.exports = GuestsCount;