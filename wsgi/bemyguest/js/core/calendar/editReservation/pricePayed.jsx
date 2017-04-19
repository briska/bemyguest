const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import nl2br from 'react-nl2br';
import actions from 'core/actions';
import EditTools from 'core/calendar/editReservation/editTools';
import cx from 'classnames';

let PricePayed = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: false,
            saving: false,
            pricePayed: propsSrc.pricePayed
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
                'pricePayed': this.state.pricePayed
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
        let {edit, saving, pricePayed} = this.state;
        if (!this.props.canEdit) edit = false;
        return (
            <div className={cx('price-payed', 'form-group', edit && 'editing')} onDoubleClick={this.startEditing}>
                <label className="inline">{trans('PRICE_PAYED')}</label>
                {edit &&
                    <input type="number" value={pricePayed} name="pricePayed" ref="focusTarget" onChange={this.handleChange} />}
                {!edit &&
                    <span>{pricePayed}</span>}
                <span className="euro"> €</span>
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = PricePayed;
