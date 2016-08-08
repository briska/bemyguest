const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import {Glyphicon, Button} from 'react-bootstrap';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let Contact = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            contactName: this.props.contactName,
            contactMail: this.props.contactMail,
            contactPhone: this.props.contactPhone
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({
            edit: false,
            contactName: this.props.contactName,
            contactMail: this.props.contactMail,
            contactPhone: this.props.contactPhone
        });
    },
    
    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'contact': {
                    'contactName': this.state.contactName,
                    'contactMail': this.state.contactMail,
                    'contactPhone': this.state.contactPhone
                }
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
        let {edit, saving, contactName, contactMail, contactPhone} = this.state;
        let contact = _.filter([contactName, contactMail, contactPhone], null).join(', ');
        return (
            <div className="contact form-group" onDoubleClick={this.startEditing}>
                <label className="inline">{trans('CONTACT')}:</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <span className="edit-contact">
                        <input type="text" value={contactName} name="contactName" placeholder={trans('CONTACT_NAME')} onChange={this.handleChange} />
                        <input type="text" value={contactMail} name="contactMail" placeholder={trans('CONTACT_MAIL')} onChange={this.handleChange} />
                        <input type="text" value={contactPhone} name="contactPhone" placeholder={trans('CONTACT_PHONE')} onChange={this.handleChange} />
                    </span>}
                {!edit && contact &&
                    <span className="contact-box">{contact}</span>}
            </div>
        );
    }
});

module.exports = Contact;
