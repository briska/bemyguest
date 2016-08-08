'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var trans = require('core/utils/trans');
var LoginForm = require('core/user/loginForm');
var Modal = require('react-bootstrap').Modal;
var UserStore = require('core/user/userStore');

var UserMenu = React.createClass({
    displayName: 'UserMenu',

    render: function render() {
        var _props = this.props;
        var context = _props.context;
        var user = _props.user;
        var isLoggedOut = _props.isLoggedOut;

        return React.createElement(
            'div',
            { className: 'user-menu' },
            React.createElement(
                Modal,
                { show: isLoggedOut },
                React.createElement(
                    Modal.Body,
                    null,
                    React.createElement(
                        'h4',
                        null,
                        trans('LOGGED_OUT')
                    ),
                    React.createElement(LoginForm, { context: context, username: user ? user.username : '' })
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

module.exports = UserMenu;