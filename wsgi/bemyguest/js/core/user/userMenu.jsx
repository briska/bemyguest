const React = require('react');
const provideContext = require('fluxible-addons-react/provideContext');
const connectToStores = require('fluxible-addons-react/connectToStores');
const trans = require('core/utils/trans');
const LoginForm = require('core/user/loginForm');
const Modal = require('react-bootstrap').Modal;
const UserStore = require('core/user/userStore');


let UserMenu = React.createClass({
    render: function() {
        return (
            <div className="user-menu">
                {this.props.user && <h3>{this.props.user.username}</h3>}
                {this.props.user && <div>{this.props.user.mail}</div>}
                <Modal show={this.props.isLoggedOut}>
                    <Modal.Body>
                        <h4>{trans('LOGGED_OUT')}</h4>
                        <LoginForm context={this.props.context} username={this.props.user ? this.props.user.username : ''} />
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

module.exports = provideContext(UserMenu);
