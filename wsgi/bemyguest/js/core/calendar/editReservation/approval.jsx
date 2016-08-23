const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import actions from 'core/actions';
import {approvalBy} from 'core/utils/utils';

let Approval = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false
        };
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false});
    },
    
    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'approved': true
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
        let {edit, saving} = this.state;
        let {days} = this.props;
        return (
            <div className="approval form-group" onDoubleClick={this.startEditing}>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <span>{trans('APPROVE_RESERVATION')}</span>}
                {!edit &&
                    <span className="text-warning">{trans('WAITING_FOR_APPROVAL.' + approvalBy(days))}</span>}
            </div>
        );
    }
});

module.exports = Approval;
