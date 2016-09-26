const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import actions from 'core/actions';
const moment = require('moment');
require('moment/locale/sk');
import Meal from 'core/calendar/editReservation/meal';
import {cellHeight, cellWidth, headHeight, monthHeight, MEAL_TYPES, DIETS} from 'core/enums';
import CalendarHeader from 'core/calendar/calendarHeader';
import {getDatesRange, getActionContext} from 'core/utils/utils';
import DatePicker from 'react-datepicker';
const xhr = require('core/utils/xhr');

let Meals = React.createClass({

    getInitialState: function(){
        return {
            weekDateFrom: moment().startOf('isoWeek'),
            weekDateTo: moment().endOf('isoWeek'),
            mealsFrom: null,
            mealsTo: null,
            mealsSum: {}
        };
    },

    handleWeek: function(moveToNext) {
        if (moveToNext) {
            this.setState({weekDateFrom: this.state.weekDateFrom.add(1, 'week'), weekDateTo: this.state.weekDateTo.add(1, 'week')});
        } else {
            this.setState({weekDateFrom: this.state.weekDateFrom.subtract(1, 'week'), weekDateTo: this.state.weekDateTo.subtract(1, 'week')});
        }
    },

    setActualWeek: function() {
        this.setState({weekDateFrom: moment().startOf('isoWeek'), weekDateTo: moment().endOf('isoWeek')});
    },

    loadMeals: function() {
        let dayFrom = moment().startOf('isoWeek').subtract(2, 'week');
        let dayTo = moment().endOf('isoWeek').add(8, 'week');
        this.setState({mealsFrom: dayFrom, mealsTo: dayTo});
        xhr.get(getActionContext(), '/api/meals/?date_from=' + dayFrom.format('YYYY-MM-DD') + '&date_to=' + dayTo.format('YYYY-MM-DD'), (resp) => {
            this.setState({mealsSum: resp.body.mealsSum});
        });
    },

    componentDidMount: function componentDidMount() {
        this.loadMeals();
    },

    render: function() {
        let {weekDateFrom, weekDateTo, mealsFrom, mealsTo, mealsSum} = this.state;
        let datesRange = getDatesRange(this.state.weekDateFrom, this.state.weekDateTo);
        return (
            <div className="meals stats-section">
                <h2>{trans('MEALS')}</h2>
                <div className="week-selector">
                    <Button onClick={() => {this.setActualWeek();}} bsSize="small">
                        {trans('ACTUAL_WEEK')}
                    </Button>
                    <Button disabled={weekDateFrom.isSame(mealsFrom)} onClick={() => {this.handleWeek(false);}} bsSize="small">
                        <Glyphicon glyph='chevron-left'/>
                    </Button>
                    <Button disabled={weekDateTo.isSame(mealsTo)} onClick={() => {this.handleWeek(true);}} bsSize="small">
                        <Glyphicon glyph='chevron-right'/>
                    </Button>
                    <div className="week-date">{weekDateFrom.format('D. MMMM YYYY')} - {weekDateTo.format('D. MMMM YYYY')}</div>

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
                                            let key = date.format('DD/MM/YYYY');
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
