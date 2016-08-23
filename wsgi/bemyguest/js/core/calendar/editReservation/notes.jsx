const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import Textarea from 'react-textarea-autosize';

let Notes = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            notes: this.props.notes
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false, notes: this.props.notes});
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
            this.setState({saving: false, edit: false});
        }
    },
    
    render: function() {
        let {edit, saving, notes} = this.state;
        return (
            <div className="notes form-group" onDoubleClick={this.startEditing}>
                <label className="block">{trans('NOTES')}</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <Textarea value={notes} name="notes" onChange={this.handleChange} />}
                {!edit && notes &&
                    <div className="notes-box">{nl2br(notes)}</div>}
            </div>
        );
    }
});

module.exports = Notes;
