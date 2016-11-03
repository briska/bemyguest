const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
const cx = require('classnames');
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
import {cellWidth, headHeight, monthHeight} from 'core/enums';
import EventsStore from 'core/eventsStore';
import {OverlayTrigger, Popover} from 'react-bootstrap';

let CalendarHeader = React.createClass({

    getDefaultProps: function() {
        return {position: 'top'};
    },

    render: function() {
        let {dates, parsedEvents, position} = this.props;
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
            months.push({name: d.format('MMMM YYYY'), days: days});
        }
        let monthsComp = (
            <div className="calendar-months">
                {_.map(months, (month, i) => {
                    return (
                        <div
                            key={'month-' + i}
                            className="calendar-month"
                            style={{height: monthHeight + 'px', width: month.days * cellWidth + 'px'}}>
                            <span className={cx('month-name', position)}>{month.name}</span>
                        </div>
                    )
                })}
            </div>);
        return (
            <div className="calendar-header">
                {position == 'top' ? monthsComp : ''}
                <div className="calendar-days">
                    {_.map(dates, (date, i) => {
                        let tooltip = null;
                        let oneDay = null;
                        let inMoreDays = null;
                        if (date.format('L') in parsedEvents) {
                            let tooltipContent = "";
                            let dayEvents = parsedEvents[date.format('L')];
                            // liturgical
                            if (dayEvents[1]) {
                                let dayEv = dayEvents[1];
                                if (dayEv.dateTo == null) {
                                    oneDay = dayEv;
                                } else {
                                    inMoreDays = dayEv;
                                }
                                tooltipContent = tooltipContent + (tooltipContent ? ", " :  "") + dayEv.name;
                            }
                            // community
                            if (dayEvents[2]) {
                                let dayEv = dayEvents[2];
                                if (dayEv.dateTo == null) {
                                    oneDay = dayEv;
                                } else {
                                    inMoreDays = dayEv;
                                }
                                tooltipContent = tooltipContent + (tooltipContent ? ", " :  "") + dayEv.name
                            }

                            tooltip = (<Popover key={'pop-' + '-' + date.format('L')} id={'pop-' + '-' + date.format('L')} bsClass={cx('visits-popup', 'small', 'popover')} role="tooltip">
                                {tooltipContent}
                            </Popover>);
                        }



                        let innerCell = (<div className={cx(
                                'inner-wrapper',
                                inMoreDays ? 'more-days-' + inMoreDays.color : ''
                            )}>
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
                                    oneDay ? 'one-day-' + oneDay.color : ''
                                )}
                                style={{width: cellWidth + 'px', height: headHeight + 'px'}}>
                                {tooltip != null ? <OverlayTrigger placement="top" overlay={tooltip} trigger="click" rootClose={true} container={this}>{innerCell}</OverlayTrigger> : innerCell}
                            </div>
                        );
                    })}
                </div>
                {position == 'bottom' ? monthsComp : ''}
            </div>
        );
    }
});

CalendarHeader = connectToStores(CalendarHeader, [EventsStore], (context, props) => ({
    parsedEvents: context.getStore(EventsStore).getParsedEvents()
}));

module.exports = CalendarHeader;
