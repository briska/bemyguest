'use strict';

var React = require('react');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var trans = require('core/utils/trans');
var LoginForm = require('core/user/loginForm');
var Modal = require('react-bootstrap').Modal;
var UserStore = require('core/user/userStore');

var UserMenu = React.createClass({
    displayName: 'UserMenu',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'user-menu' },
            this.props.user && React.createElement(
                'h3',
                null,
                this.props.user.username
            ),
            this.props.user && React.createElement(
                'div',
                null,
                this.props.user.mail
            ),
            React.createElement(
                Modal,
                { show: this.props.isLoggedOut },
                React.createElement(
                    Modal.Body,
                    null,
                    React.createElement(
                        'h4',
                        null,
                        trans('LOGGED_OUT')
                    ),
                    React.createElement(LoginForm, { context: this.props.context, username: this.props.user ? this.props.user.username : '' })
                )
            )
        );
    }
});

UserMenu = connectToStores(UserMenu, [UserStore], function (context, props) {
    return {
        user: context.getStore(UserStore).getUser(),
        isLoggedOut: context.getStore(UserStore).isLoggedOut()
    };
});

module.exports = provideContext(UserMenu);