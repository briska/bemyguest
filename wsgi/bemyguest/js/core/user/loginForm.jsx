const React = require('react');
const provideContext = require('fluxible-addons-react/provideContext');
const actions = require('core/actions');
const trans = require('core/utils/trans');

let LoginForm = React.createClass({
    getInitialState: function() {
        return {username: this.props.username};
    },
    
    handleUsernameChange: function(event) {
        this.setState({username: event.target.value});
    },
    
    submitForm: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.context.executeAction(actions.logIn, {'username': this.state.username, 'password': this.refs.password.value});
    },
    
    render: function() {
        return (
            <form className="login-form" onSubmit={this.submitForm}>
                <div>
                    <label>{trans('USERNAME')}</label>
                    <input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                </div>
                <div>
                    <label>{trans('PASSWORD')}</label>
                    <input type="password" name="password" ref="password" />
                </div>
                <input type="submit" name="submit" value={trans('LOG_IN')} />
            </form>
        );
    }
});

module.exports = provideContext(LoginForm);