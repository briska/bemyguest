'use strict';

var _enums = require('core/enums');

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');


var CalendarHeader = React.createClass({
    displayName: 'CalendarHeader',

    render: function render() {
        var dates = this.props.dates;

        var dateFrom = _.nth(dates, 0);
        var dateTo = _.nth(dates, -1);
        var today = moment();
        var months = [];
        for (var d = moment(dateFrom); d.isSameOrBefore(dateTo, 'month'); d.add(1, 'months')) {
            var days = void 0;
            if (dateFrom.isSame(dateTo, 'month')) {
                days = dateTo.diff(dateFrom, 'days') + 1;
            } else if (d.isSame(dateFrom, 'month')) {
                days = moment(dateFrom).endOf('month').diff(dateFrom, 'days') + 1;
            } else if (d.isSame(dateTo, 'month')) {
                days = dateTo.date();
            } else {
                days = moment(d).endOf('month').date();
            }
            months.push({ name: d.format('MMMM'), days: days });
        }
        return React.createElement(
            'div',
            { className: 'calendar-header' },
            React.createElement(
                'div',
                { className: 'calendar-months' },
                _.map(months, function (month, i) {
                    return React.createElement(
                        'div',
                        {
                            key: 'month-' + i,
                            className: 'calendar-month',
                            style: { height: _enums.monthHeight + 'px', width: month.days * _enums.cellWidth + 'px' } },
                        React.createElement(
                            'span',
                            { className: 'month-name' },
                            month.name
                        )
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'calendar-days' },
                _.map(dates, function (date, i) {
                    return React.createElement(
                        'div',
                        {
                            key: 'date-' + i,
                            className: cx('calendar-day', date.isSame(today, 'day') ? 'today' : '', date.day() === 0 ? 'sunday' : ''),
                            style: { width: _enums.cellWidth + 'px', height: _enums.headHeight + 'px' } },
                        React.createElement(
                            'span',
                            { className: 'day-number' },
                            date.format('Do')
                        ),
                        React.createElement(
                            'span',
                            { className: 'day-name' },
                            date.format('dddd')
                        )
                    );
                })
            )
        );
    }
});

module.exports = CalendarHeader;