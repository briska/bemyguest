const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const moment = require('moment');
require('moment/locale/sk');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Label from 'react-bootstrap/lib/Label';
import DatePicker from 'react-datepicker';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let OverallDate = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false,
            dateFrom: this.props.reservationDateFrom,
            dateTo: this.props.reservationDateTo
        };
    },

    handleDate: function(key, date) {
        this.setState({[key]: date});
    },

    startEditing: function() {
        this.setState({edit: true});
    },

    cancel: function() {
        this.setState({edit: false, dateFrom: this.props.reservationDateFrom, dateTo: this.props.reservationDateTo});
    },

    save: function() {
        this.setState({saving: true});
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'overallDate': {
                    'dateFrom' : this.state.dateFrom,
                    'dateTo': this.state.dateTo
                }
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
        let {edit, saving, dateFrom, dateTo} = this.state;
        if (edit) {
            return (
                <div className="overall-date form-group">
                    {edit && !saving &&
                        <Button className="form-group-button cancel" onClick={this.cancel}><Glyphicon glyph="remove" /></Button>}
                    {edit && !saving &&
                        <Button bsStyle="success" className="form-group-button save" onClick={this.save}><Glyphicon glyph="ok" /></Button>}
                    {edit && !saving &&
                        <div className="form-group-button note text-warning">{trans('OVERALL_WARN_MSG')}</div>}
                    <div className="date">
                        <DatePicker
                            dateFormat="DD. MM. YYYY"
                            selected={dateFrom}
                            maxDate={moment(dateTo).subtract(1, 'days')}
                            onChange={(date) => {this.handleDate('dateFrom', date);}} />
                        <span> - </span>
                        <DatePicker
                            dateFormat="DD. MM. YYYY"
                            selected={dateTo}
                            minDate={moment(dateFrom).add(1, 'days')}
                            onChange={(date) => {this.handleDate('dateTo', date);}} />
                    </div>
                </div>
            );
        }
        return (
            <div className="overall-date form-group" onDoubleClick={this.startEditing}>
                <label className="inline">{trans('OVERALL_DATE')}:</label>
                <div className="date">{dateFrom.format('D. MMMM YYYY')} - {dateTo.format('D. MMMM YYYY')}</div>
            </div>
        );
    }
});

module.exports = OverallDate;