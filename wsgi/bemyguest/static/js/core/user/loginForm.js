'use strict';

var React = require('react');
var provideContext = require('fluxible-addons-react/provideContext');
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
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    trans('USERNAME')
                ),
                React.createElement('input', { type: 'text', name: 'username', value: this.state.username, onChange: this.handleUsernameChange })
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    trans('PASSWORD')
                ),
                React.createElement('input', { type: 'password', name: 'password', ref: 'password' })
            ),
            React.createElement('input', { type: 'submit', name: 'submit', value: trans('LOG_IN') })
        );
    }
});

module.exports = provideContext(LoginForm);