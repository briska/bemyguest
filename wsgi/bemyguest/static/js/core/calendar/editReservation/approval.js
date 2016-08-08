'use strict';

var _reactBootstrap = require('react-bootstrap');

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utils = require('core/utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');


var Approval = React.createClass({
    displayName: 'Approval',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false
        };
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        this.setState({ edit: false });
    },

    save: function save() {
        this.setState({ saving: true });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'approved': true
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
        var days = this.props.days;

        return React.createElement(
            'div',
            { className: 'approval form-group', onDoubleClick: this.startEditing },
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
            edit && React.createElement(
                'span',
                null,
                trans('APPROVE_RESERVATION')
            ),
            !edit && React.createElement(
                'span',
                { className: 'text-warning' },
                trans('WAITING_FOR_APPROVAL.' + (0, _utils.approvalBy)(days))
            )
        );
    }
});

module.exports = Approval;