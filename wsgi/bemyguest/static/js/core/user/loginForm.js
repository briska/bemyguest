'use strict';

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var ReactDOM = require('react-dom');
var actions = require('core/actions');
var trans = require('core/utils/trans');


var LoginForm = React.createClass({
    displayName: 'LoginForm',

    getInitialState: function getInitialState() {
        return { username: this.props.username };
    },

    handleUsernameChange: function handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    },

    submitForm: function submitForm(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.context.executeAction(actions.logIn, { 'username': this.state.username, 'password': this.refs.password.value });
    },

    render: function render() {
        return React.createElement(
            'form',
            { className: 'login-form', onSubmit: this.submitForm },
            React.createElement(
                'label',
                null,
                trans('USERNAME')
            ),
            React.createElement('input', { type: 'text', value: this.state.username, onChange: this.handleUsernameChange }),
            React.createElement(
                'label',
                null,
                trans('PASSWORD')
            ),
            React.createElement('input', { type: 'password', ref: 'password' }),
            React.createElement(
                _Button2.default,
                { type: 'submit' },
                trans('LOG_IN')
            )
        );
    }
});

module.exports = LoginForm;