const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import EditTools from 'core/calendar/editReservation/editTools';
import cx from 'classnames';

let Contact = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: false,
            saving: false,
            contactName: propsSrc.contactName,
            contactMail: propsSrc.contactMail,
            contactPhone: propsSrc.contactPhone
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props);
    },

    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },

    startEditing: function() {
        this.setState({edit: true});
    },

    cancel: function() {
        this.setState(this.getStateFromSource(this.props));
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
            this.setState(this.getStateFromSource(nextProps));
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.edit && !prevState.edit) {
            this.refs.focusTarget.select();
        }
    },

    render: function() {
        let {edit, saving, contactName, contactMail, contactPhone} = this.state;
        let contact = _.filter([contactName, contactMail, contactPhone], null).join(', ');
        return (
            <div className={cx('contact', 'form-group', edit && 'editing')} onDoubleClick={this.startEditing}>
                <label className="inline">{trans('CONTACT')}</label>
                {edit &&
                    <span className="edit-contact">
                        <input type="text" value={contactName} name="contactName"  ref="focusTarget" placeholder={trans('CONTACT_NAME')} onChange={this.handleChange} />
                        <input type="text" value={contactMail} name="contactMail" placeholder={trans('CONTACT_MAIL')} onChange={this.handleChange} />
                        <input type="text" value={contactPhone} name="contactPhone" placeholder={trans('CONTACT_PHONE')} onChange={this.handleChange} />
                    </span>}
                {!edit && contact &&
                    <span className="contact-box">{contact}</span>}
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = Contact;
