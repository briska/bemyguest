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
import {DATE_FORMAT} from 'core/enums';
import EditTools from 'core/calendar/editReservation/editTools';

let OverallDate = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: false,
            saving: false,
            dateFrom: propsSrc.reservationDateFrom,
            dateTo: propsSrc.reservationDateTo
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props);
    },

    handleDate: function(key, date) {
        this.setState({[key]: date});
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
                'overallDate': {
                    'dateFrom' : moment(this.state.dateFrom).hour(14).format(DATE_FORMAT),
                    'dateTo': moment(this.state.dateTo).hour(10).format(DATE_FORMAT)
                }
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps));
        } else {
            this.setState({dateFrom: nextProps.reservationDateFrom, dateTo: nextProps.reservationDateTo})
        }
    },

    render: function() {
        let {edit, saving, dateFrom, dateTo} = this.state;
        if (edit) {
            return (
                <div className="overall-date form-group">
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
                    <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} note={trans('OVERALL_WARN_MSG')} />
                </div>
            );
        }
        return (
            <div className="overall-date form-group" onDoubleClick={this.startEditing}>
                <div className="date">{dateFrom.format('D. MMMM YYYY')} - {dateTo.format('D. MMMM YYYY')}</div>
            </div>
        );
    }
});

module.exports = OverallDate;
