const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import actions from 'core/actions';
const moment = require('moment');
require('moment/locale/sk');
import Meal from 'core/calendar/editReservation/meal';
import {cellHeight, cellWidth, headHeight, monthHeight, MEAL_TYPES, DIETS, DAY_FORMAT} from 'core/enums';
import CalendarHeader from 'core/calendar/calendarHeader';
import {getDatesRange, getActionContext} from 'core/utils/utils';
const xhr = require('core/utils/xhr');

let Meals = React.createClass({

    getInitialState: function(){
        return {
            currentWeekFrom: moment().startOf('isoWeek'),
            currentWeekTo: moment().endOf('isoWeek'),
            mealsDataFrom: null,
            mealsDataTo: null,
            mealsSum: {}
        };
    },

    loadMeals: function(loadFromDay, loadToDay) {
        if (this.state.mealsDataFrom == null || loadFromDay.isBefore(this.state.mealsDataFrom)) {
            this.setState({mealsDataFrom: loadFromDay});
        }
        if (this.state.mealsDataTo == null || loadToDay.isAfter(this.state.mealsDataTo)) {
            this.setState({mealsDataTo: loadToDay});
        }
        xhr.get(getActionContext(), '/api/meals/?date_from=' + loadFromDay.format('YYYY-MM-DD') + '&date_to=' + loadToDay.format('YYYY-MM-DD'), (resp) => {
            this.setState({mealsSum: _.assign({}, this.state.mealsSum, resp.body.mealsSum)});
        });
    },

    setActualWeek: function() {
        this.setState({currentWeekFrom: moment().startOf('isoWeek'), currentWeekTo: moment().endOf('isoWeek')});
    },

    handleWeek: function(moveToNext) {
        if (moveToNext) {
            this.setState({currentWeekFrom: this.state.currentWeekFrom.add(1, 'week'), currentWeekTo: this.state.currentWeekTo.add(1, 'week')});
        } else {
            this.setState({currentWeekFrom: this.state.currentWeekFrom.subtract(1, 'week'), currentWeekTo: this.state.currentWeekTo.subtract(1, 'week')});
        }
    },

    componentDidMount: function() {
        this.loadMeals(moment().startOf('isoWeek').subtract(5, 'week'), moment().startOf('isoWeek').add(5, 'week'));
    },

    componentWillUpdate: function(nextProps, nextState) {
        if (nextState.currentWeekFrom.isSameOrBefore(nextState.mealsDataFrom)) {
            this.loadMeals(moment(nextState.currentWeekFrom).subtract(5, 'week'), moment(nextState.mealsDataFrom));
        } else if (nextState.currentWeekTo.isSameOrAfter(nextState.mealsDataTo)) {
            this.loadMeals(moment(nextState.mealsDataTo), moment(nextState.currentWeekTo).add(5, 'week'));
        }
    },

    render: function() {
        let {currentWeekFrom, currentWeekTo, mealsDataFrom, mealsDataTo, mealsSum} = this.state;
        let datesRange = getDatesRange(this.state.currentWeekFrom, this.state.currentWeekTo);
        return (
            <div className="meals stats-section">
                <h2>{trans('MEALS')}</h2>
                <div className="week-selector">
                    <Button onClick={() => {this.setActualWeek();}} bsSize="small">
                        {trans('ACTUAL_WEEK')}
                    </Button>
                    <Button onClick={() => {this.handleWeek(false);}} bsSize="small">
                        <Glyphicon glyph='chevron-left'/>
                    </Button>
                    <Button onClick={() => {this.handleWeek(true);}} bsSize="small">
                        <Glyphicon glyph='chevron-right'/>
                    </Button>
                    <a href={'/pdf/meals/?date_from=' + currentWeekFrom.format(DAY_FORMAT) + '&date_to=' + currentWeekTo.format(DAY_FORMAT)} className="btn btn-primary btn-sm"
                            target="_blank">
                        <Glyphicon glyph='download-alt'/> {trans('PDF')}
                    </a>
                </div>
                <div className="meal-types calendar-aside" style={{marginTop: monthHeight + 'px'}}>
                    <div className="aside-cell" style={{height: headHeight + 'px'}}></div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('BREAKFAST')}</div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('LUNCH')}</div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('DINNER')}</div>
                </div>
                <div className="calendar-sheet-container">
                    <div className="calendar-sheet" style={{width: _.size(datesRange) * cellWidth + 'px'}}>
                        <CalendarHeader context={context} dates={datesRange} />
                        <div className="calendar-table">
                            {_.map(MEAL_TYPES, (type) => {
                                return (
                                    <div className="calendar-row" key={'meal-row-' + type}>
                                        {_.map(datesRange, (date, i) => {
                                            let key = date.format(DAY_FORMAT);
                                            return (
                                                <Meal
                                                    key={'meal-' + i + '-' + type}
                                                    ref={'mealD' + i + 'T' + type}
                                                    context={context}
                                                    counts={mealsSum[key] ? mealsSum[key][type] : _.times(_.size(DIETS), _.constant(0))} />
                                            )
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Meals;
