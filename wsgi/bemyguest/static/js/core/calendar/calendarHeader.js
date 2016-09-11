'use strict';

var _enums = require('core/enums');

var _feastsStore = require('core/feastsStore');

var _feastsStore2 = _interopRequireDefault(_feastsStore);

var _OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');

var _OverlayTrigger2 = _interopRequireDefault(_OverlayTrigger);

var _Tooltip = require('react-bootstrap/lib/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');
var cx = require('classnames');
var moment = require('moment');
require('moment/locale/sk');
var connectToStores = require('fluxible-addons-react/connectToStores');


var CalendarHeader = React.createClass({
    displayName: 'CalendarHeader',

    render: function render() {
        var _this = this;

        var _props = this.props;
        var dates = _props.dates;
        var feasts = _props.feasts;

        var dateFrom = _.nth(dates, 0);
        var dateTo = _.nth(dates, -1);
        var today = moment();
        var months = [];
        // get array of months (month name, number of days we have for this month in dates array)
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

                    var tooltip = null;
                    if (date.format('L') in feasts) {
                        tooltip = React.createElement(
                            _Tooltip2.default,
                            { id: 'tooltip' },
                            feasts[date.format('L')].name
                        );
                    }

                    var innerCell = React.createElement(
                        'div',
                        { className: 'inner-wrapper' },
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

                    return React.createElement(
                        'div',
                        {
                            key: 'date-' + i,
                            className: cx('calendar-day', date.isSame(today, 'day') ? 'today' : '', date.day() === 0 ? 'sunday' : '', date.format('L') in feasts ? 'feast-' + feasts[date.format('L')].color : ''),
                            style: { width: _enums.cellWidth + 'px', height: _enums.headHeight + 'px' } },
                        tooltip != null ? React.createElement(
                            _OverlayTrigger2.default,
                            { placement: 'top', overlay: tooltip, trigger: 'click', rootClose: true, container: _this },
                            innerCell
                        ) : innerCell
                    );
                })
            )
        );
    }
});

CalendarHeader = connectToStores(CalendarHeader, [_feastsStore2.default], function (context, props) {
    return {
        feasts: context.getStore(_feastsStore2.default).getFeasts()
    };
});

module.exports = CalendarHeader;