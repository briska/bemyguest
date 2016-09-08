const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let SpiritualGuide = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            spiritualGuide: this.props.spiritualGuide
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false, spiritualGuide: this.props.spiritualGuide});
    },
    
    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'spiritualGuide': this.state.spiritualGuide
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
        let {edit, saving, spiritualGuide} = this.state;
        return (
            <div className="spiritual-guide form-group" onDoubleClick={this.startEditing}>
                <label className="inline">{trans('SPIRITUAL_GUIDE')}:</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <input type="text" value={spiritualGuide} name="spiritualGuide" onChange={this.handleChange} />}
                {!edit && spiritualGuide && <span>{spiritualGuide}</span>}
            </div>
        );
    }
});

module.exports = SpiritualGuide;