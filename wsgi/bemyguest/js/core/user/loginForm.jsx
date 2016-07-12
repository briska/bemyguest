const React = require('react');
const ReactDOM = require('react-dom');
const provideContext = require('fluxible-addons-react/provideContext');
const actions = require('core/actions');
const trans = require('core/utils/trans');
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

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
        this.props.context.executeAction(actions.logIn, {'username': this.state.username, 'password': ReactDOM.findDOMNode(this.refs.password).value});
    },
    
    render: function() {
        return (
            <form className="login-form" onSubmit={this.submitForm}>
                <FormGroup controlId="login-username">
                    <ControlLabel>{trans('USERNAME')}</ControlLabel>
                    <FormControl type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                </FormGroup>
                <FormGroup controlId="login-password">
                    <ControlLabel>{trans('PASSWORD')}</ControlLabel>
                    <FormControl type="password" ref="password" />
                </FormGroup>
                <Button type="submit">{trans('LOG_IN')}</Button>
            </form>
        );
    }
});

module.exports = provideContext(LoginForm);