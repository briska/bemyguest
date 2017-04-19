const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import actions from 'core/actions';
import {approvalBy} from 'core/utils/utils';
import EditTools from 'core/calendar/editReservation/editTools';
import cx from 'classnames';

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
        if (!this.props.canEdit) edit = false;
        let {days} = this.props;
        return (
            <div className={cx('approval', 'form-group', edit && 'editing')} onDoubleClick={this.startEditing}>
                {edit &&
                    <span>{trans('APPROVE_RESERVATION')}</span>}
                {!edit &&
                    <span className="text-warning">{trans('WAITING_FOR_APPROVAL.' + approvalBy(days))}</span>}
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = Approval;
