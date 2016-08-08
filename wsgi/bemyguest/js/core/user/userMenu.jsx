const React = require('react');
const connectToStores = require('fluxible-addons-react/connectToStores');
const trans = require('core/utils/trans');
const LoginForm = require('core/user/loginForm');
const Modal = require('react-bootstrap').Modal;
const UserStore = require('core/user/userStore');


let UserMenu = React.createClass({
    render: function() {
        let {context, user, isLoggedOut} = this.props;
        return (
            <div className="user-menu">
                <Modal show={isLoggedOut}>
                    <Modal.Body>
                        <h4>{trans('LOGGED_OUT')}</h4>
                        <LoginForm context={context} username={user ? user.username : ''} />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
});

UserMenu = connectToStores(UserMenu, [UserStore], (context, props) => ({
    user: context.getStore(UserStore).getUser(),
    isLoggedOut: context.getStore(UserStore).isLoggedOut()
}));

module.exports = UserMenu;
