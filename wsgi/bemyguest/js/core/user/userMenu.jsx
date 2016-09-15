const React = require('react');
const connectToStores = require('fluxible-addons-react/connectToStores');
const trans = require('core/utils/trans');
const LoginForm = require('core/user/loginForm');
import Modal from 'react-bootstrap/lib/Modal';
import Alert from 'react-bootstrap/lib/Alert';
const UserStore = require('core/user/userStore');

let UserMenu = React.createClass({
    render: function() {
        let {context, user, isLoggedOut, error} = this.props;
        return (
            <div className="user-menu">
                <Modal show={isLoggedOut}>
                    <Modal.Header>
                        <h4>{trans('LOGGED_OUT')}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert bsStyle="warning">{trans('INVALID_CREDENTIALS')}</Alert>}
                        <LoginForm context={context} username={user ? user.username : ''} />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
});

UserMenu = connectToStores(UserMenu, [UserStore], (context, props) => ({
    user: context.getStore(UserStore).getUser(),
    isLoggedOut: context.getStore(UserStore).isLoggedOut(),
    error: context.getStore(UserStore).hasError()
}));

module.exports = UserMenu;
