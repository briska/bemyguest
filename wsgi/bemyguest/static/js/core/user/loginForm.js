'use strict';

var _reactBootstrap = require('react-bootstrap');

var React = require('react');
var ReactDOM = require('react-dom');
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
        this.props.context.executeAction(actions.logIn, { 'username': this.state.username, 'password': ReactDOM.findDOMNode(this.refs.password).value });
    },

    render: function render() {
        return React.createElement(
            'form',
            { className: 'login-form', onSubmit: this.submitForm },
            React.createElement(
                _reactBootstrap.FormGroup,
                { controlId: 'login-username' },
                React.createElement(
                    _reactBootstrap.ControlLabel,
                    null,
                    trans('USERNAME')
                ),
                React.createElement(_reactBootstrap.FormControl, { type: 'text', value: this.state.username, onChange: this.handleUsernameChange })
            ),
            React.createElement(
                _reactBootstrap.FormGroup,
                { controlId: 'login-password' },
                React.createElement(
                    _reactBootstrap.ControlLabel,
                    null,
                    trans('PASSWORD')
                ),
                React.createElement(_reactBootstrap.FormControl, { type: 'password', ref: 'password' })
            ),
            React.createElement(
                _reactBootstrap.Button,
                { type: 'submit' },
                trans('LOG_IN')
            )
        );
    }
});

module.exports = provideContext(LoginForm);