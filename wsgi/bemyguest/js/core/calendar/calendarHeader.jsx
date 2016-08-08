const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
import {cellWidth, headHeight, monthHeight} from 'core/enums';

let CalendarHeader = React.createClass({
    render: function() {
        let {dates} = this.props;
        let dateFrom = _.nth(dates, 0);
        let dateTo = _.nth(dates, -1);
        let months = [];
        for (let d = moment(dateFrom); d.isSameOrBefore(dateTo, 'month'); d.add(1, 'months')) {
            let days;
            if (dateFrom.isSame(dateTo, 'month')) {
                days = dateTo.diff(dateFrom, 'days') + 1;
            }
            else if (d.isSame(dateFrom, 'month')) {
                days = moment(dateFrom).endOf('month').diff(dateFrom, 'days') + 1;
            }
            else if (d.isSame(dateTo, 'month')) {
                days = dateTo.date();
            }
            else {
                days = moment(d).endOf('month').date();
            }
            months.push({name: d.format('MMMM'), days: days});
        }
        return (
            <div className="calendar-header">
                <div className="calendar-months">
                    {_.map(months, (month, i) => {
                        return (
                            <div
                                key={'month-' + i}
                                className="calendar-month"
                                style={{height: monthHeight + 'px', width: month.days * cellWidth + 'px'}}>
                                <span className="month-name">{month.name}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="calendar-days">
                    {_.map(dates, (date, i) => {
                        return (
                            <div
                                key={'date-' + i}
                                className={'calendar-day'}
                                style={{width: cellWidth + 'px', height: headHeight + 'px'}}>
                                <span className="day-number">{date.format('Do')}</span>
                                <span className="day-name">{date.format('dddd')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = CalendarHeader;
