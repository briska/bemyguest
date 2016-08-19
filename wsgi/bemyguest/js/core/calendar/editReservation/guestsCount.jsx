const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import {Glyphicon, Button} from 'react-bootstrap';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let GuestsCount = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            guestsCount: this.props.guestsCount
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false, guestsCount: this.props.guestsCount});
    },
    
    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'guestsCount': this.state.guestsCount
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState({saving: false, edit: false});
        }
    },
    
    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.edit && !prevState.edit) {
            this.refs.control.select();
        }
    },
    
    render: function() {
        let {edit, saving, guestsCount} = this.state;
        return (
            <div className="guests-count form-group" onDoubleClick={this.startEditing}>
                <label className="inline">{trans('GUESTS_COUNT')}:</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <input type="number" value={guestsCount} name="guestsCount" ref="control" onChange={this.handleChange} />}
                {!edit &&
                    <span>{guestsCount}</span>}
            </div>
        );
    }
});

module.exports = GuestsCount;
