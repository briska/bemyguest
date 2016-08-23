const React = require('react');
const ReactDOM = require('react-dom');
const actions = require('core/actions');
const trans = require('core/utils/trans');
import Button from 'react-bootstrap/lib/Button';

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
                    <label>{trans('USERNAME')}</label>
                <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                    <label>{trans('PASSWORD')}</label>
                <input type="password" ref="password" />
                <Button type="submit">{trans('LOG_IN')}</Button>
            </form>
        );
    }
});

module.exports = LoginForm;