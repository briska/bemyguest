const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import EditTools from 'core/calendar/editReservation/editTools';
import cx from 'classnames';

let MailCommunication = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: false,
            saving: false,
            mailCommunication: propsSrc.mailCommunication
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
                'mailCommunication': this.state.mailCommunication
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps));
        }
    },

    render: function() {
        let {edit, saving, mailCommunication} = this.state;
        return (
            <div className={cx('mail-communication', 'form-group', edit && 'editing')} onDoubleClick={this.startEditing}>
                <label className="block">{trans('MAIL_COMMUNICATION')}</label>
                {edit &&
                    <textarea value={mailCommunication} name="mailCommunication" autoFocus onChange={this.handleChange} />}
                {!edit && mailCommunication &&
                    <div className="mail-communication-box">{nl2br(mailCommunication)}</div>}
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = MailCommunication;
