const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const moment = require('moment');
require('moment/locale/sk');
import Button from 'react-bootstrap/lib/Button';
import DatePicker from 'react-datepicker';
import nl2br from 'react-nl2br';
import actions from 'core/actions';

let DaySelector = React.createClass({
    getInitialState: function() {
        return {
            startDay: moment(),
            dateFrom: this.props.dateFrom,
            dateTo: this.props.dateTo
        };
    },

    handleStartDay: function(date) {
        this.setState({startDay: date});
        this.props.scrollCalendar(date);
    },

    render: function() {
        let {startDay, dateFrom, dateTo} = this.state;
        return (
            <div className="day-selecor form-group">
                <span className="inline-elem">{trans('FROM')}:</span>
                <DatePicker
                    dateFormat="DD. MM. YYYY"
                    selected={startDay}
                    className="inline-elem"
                    minDate={moment(dateFrom).add(1, 'days')}
                    maxDate={moment(dateTo).subtract(1, 'days')}
                    onChange={(date) => {this.handleStartDay(date);}} />
                <Button onClick={() => {this.handleStartDay(moment());}} bsSize="small">{trans('TODAY')}</Button>
            </div>
        );
    }
});

module.exports = DaySelector;
