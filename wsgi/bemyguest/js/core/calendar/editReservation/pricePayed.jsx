const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import {Glyphicon, Button} from 'react-bootstrap';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let PricePayed = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            pricePayed: this.props.pricePayed
        };
    },
    
    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },
    
    startEditing: function() {
        this.setState({edit: true});
    },
    
    cancel: function() {
        this.setState({edit: false, pricePayed: this.props.pricePayed});
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
            this.setState({saving: false, edit: false});
        }
    },
    
    render: function() {
        let {edit, saving, pricePayed} = this.state;
        return (
            <div className="price-payed form-group" onDoubleClick={this.startEditing}>
                <label className="inline">{trans('PRICE_PAYED')}:</label>
                {edit && !saving &&
                    <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                {edit && !saving &&
                    <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                {edit &&
                    <input type="number" value={pricePayed} name="pricePayed" onChange={this.handleChange} />}
                {!edit &&
                    <span>{pricePayed}</span>}
                <span className="euro">€</span>
            </div>
        );
    }
});

module.exports = PricePayed;
