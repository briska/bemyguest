const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import DatePicker from 'react-datepicker';
const moment = require('moment');
require('moment/locale/sk');
import {translateEventType} from 'core/utils/utils';

let EventDetail = React.createClass({
    getStateFromSource: function(event) {
        if (event) {
            return {
                name: event.name,
                dateFrom: event.dateFrom,
                dateTo: event.dateTo,
                type: event.type,
                color: event.color
            };
        }
        return {
            name: '',
            dateFrom: null,
            dateTo: null,
            type: '',
            color: ''
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props.event);
    },

    handleChange: function(e) {
        this.setState({[e.target.name]: e.target.value});
    },

    handleKV: function(key, value) {
        this.setState({[key]: value});
    },

    getEvent: function() {
        return {
            id: this.props.event && this.props.event.id ? this.props.event.id : null,
            name: this.state.name,
            dateFrom: this.state.dateFrom,
            dateTo: this.state.dateTo,
            type: this.state.type,
            color: this.state.color,
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.event === "open_empty") {
            this.setState(this.getStateFromSource(null));
        }
    },

    isValid: function() {
        let {name, dateFrom, type, color} = this.state;
        if (!(name && dateFrom && type && color)) {
            return false;
        }
        return true;
    },

    render: function() {
        let {name, dateFrom, dateTo, type, color} = this.state;
        let colors = [1, 2, 3, 4, 5, 6, 7];
        return (
            <div className="event-detail">
                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="name">{trans('NAME')}</label>
                    <div className="col-md-7">
                        <input className="form-element" type="text" id="name" name="name" value={name || ""} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="dateFrom">{trans('FROM')}-{trans('TO')}</label>
                    <div className="col-md-7">
                    <DatePicker
                        className="form-element"
                        dateFormat="DD. MM. YYYY"
                        selected={dateFrom}
                        maxDate={moment(dateTo).subtract(1, 'days')}
                        onChange={(date) => {this.handleKV('dateFrom', date);}} />
                    <span> - </span>
                    <DatePicker
                        className="form-element"
                        dateFormat="DD. MM. YYYY"
                        selected={dateTo}
                        minDate={moment(dateFrom).add(1, 'days')}
                        onChange={(date) => {this.handleKV('dateTo', date);}} />
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="type">{trans('EVENT_TYPE')}</label>
                    <div className="col-md-7">
                        <select className="form-element" id="type" name="type" onChange={this.handleChange} defaultValue={type || 0}>
                            <option disabled value="0"></option>
                            <option value="1">{trans('EVENT_TYPE_NAME.' + translateEventType(1))}</option>
                            <option value="2">{trans('EVENT_TYPE_NAME.' + translateEventType(2))}</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <label className={cx('col-md-3', 'form-label')} htmlFor="color">{trans('EVENT_COLOR')}</label>
                    <div className="col-md-7">
                        {_.map(colors, (c, i) => {
                            let selectedColor = color == c;
                            return (
                                <div key={'event-color-preview-' + c} className={cx('event-color-preview-' + c, 'event-color-sample')} onClick={() => {this.handleKV('color', c);}}>
                                    {selectedColor && <Glyphicon glyph="ok"/>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = EventDetail;
