const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
import {cellWidth, headHeight, monthHeight} from 'core/enums';
import FeastsStore from 'core/feastsStore';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

let CalendarHeader = React.createClass({
    render: function() {
        let {dates, feasts} = this.props;
        let dateFrom = _.nth(dates, 0);
        let dateTo = _.nth(dates, -1);
        let today = moment();
        let months = [];
        // get array of months (month name, number of days we have for this month in dates array)
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
                        
                        let tooltip = null;
                        if (date.format('L') in feasts) {
                             tooltip = (<Tooltip id="tooltip">{feasts[date.format('L')].name}</Tooltip>);
                        }

                        let innerCell = (<div className="inner-wrapper">
                            <span className="day-number">{date.format('Do')}</span>
                            <span className="day-name">{date.format('dddd')}</span>
                        </div>);

                        return (
                            <div
                                key={'date-' + i}
                                className={cx(
                                    'calendar-day',
                                    date.isSame(today, 'day') ? 'today' : '',
                                    date.day() === 0 ? 'sunday' : '',
                                    date.format('L') in feasts ? 'feast-' + feasts[date.format('L')].color : ''
                                )}
                                style={{width: cellWidth + 'px', height: headHeight + 'px'}}>
                                {tooltip != null ? <OverlayTrigger placement="top" overlay={tooltip} trigger="click" rootClose={true} container={this}>{innerCell}</OverlayTrigger> : innerCell}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

CalendarHeader = connectToStores(CalendarHeader, [FeastsStore], (context, props) => ({
    feasts: context.getStore(FeastsStore).getFeasts()
}));

module.exports = CalendarHeader;
