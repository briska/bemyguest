const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import {Glyphicon, Button} from 'react-bootstrap';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let MailCommunication = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            mailCommunication: this.props.mailCommunication
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false, mailCommunication: this.props.mailCommunication});
    },
    
    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'mailCommunication': this.state.mailCommunication
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState({saving: false, edit: false});
        }
    },
    
    render: function() {
        let {edit, saving, mailCommunication} = this.state;
        return (
            <div className="mail-communication form-group" onDoubleClick={this.startEditing}>
                <label className="block">{trans('MAIL_COMMUNICATION')}</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <textarea value={mailCommunication} name="mailCommunication" onChange={this.handleChange} />}
                {!edit && mailCommunication &&
                    <div className="mail-communication-box">{nl2br(mailCommunication)}</div>}
            </div>
        );
    }
});

module.exports = MailCommunication;
