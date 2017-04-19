const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import Textarea from 'react-textarea-autosize';
import EditTools from 'core/calendar/editReservation/editTools';
import cx from 'classnames';

let Notes = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: false,
            saving: false,
            notes: propsSrc.notes
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
                'notes': this.state.notes
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
        let {edit, saving, notes} = this.state;
        if (!this.props.canEdit) edit = false;
        return (
            <div className={cx('notes', 'form-group', edit && 'editing')} onDoubleClick={this.startEditing}>
                <label className="block">{trans('NOTES')}</label>
                {edit &&
                    <Textarea value={notes} name="notes" autoFocus onChange={this.handleChange} />}
                {!edit && notes &&
                    <div className="notes-box">{nl2br(notes)}</div>}
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = Notes;
