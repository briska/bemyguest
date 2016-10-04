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
import {diffDays} from 'core/utils/utils';
import CalendarHeader from 'core/calendar/calendarHeader';
import EditTools from 'core/calendar/editReservation/editTools';

let Meals = React.createClass({
    getInitialState: function() {
        return {
            edit: false,
            saving: false
        };
    },

    startEditing: function() {
        this.setState({edit: true});
    },

    cancel: function() {
        _.each(this.refs, (meal) => {meal.cancel();});
        this.setState({edit: false});
    },

    save: function() {
        this.setState({saving: true});
        let meals = _.map(this.props.datesRange, (date, i) => {
            return {
                date: date.format(DAY_FORMAT),
                counts: _.map(MEAL_TYPES, (type) => {
                    return this.refs['mealD' + i + 'T' + type].getCounts();
                })
            };
        });
        let payload = {
            'id': this.props.reservationId,
            'data': {
                'meals': meals
            }
        };
        this.props.context.executeAction(actions.editReservation, payload);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState({saving: false, edit: false});
        }
    },

    updateCount: function(mealType, updateType) {
        _.map(this.props.datesRange, (date, i) => {
            this.refs['mealD' + i + 'T' + mealType].updateCount(updateType);
        });
    },

    render: function() {
        let {edit, saving} = this.state;
        let {meals, datesRange, guestsCount} = this.props;
        return (
            <div className="meals form-group" onDoubleClick={this.startEditing}>
                <h4>{trans('MEALS')}</h4>
                <div className="meal-types calendar-aside" style={{marginTop: monthHeight + 'px'}}>
                    <div className="aside-cell" style={{height: headHeight + 'px'}}></div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('BREAKFAST')}</div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('LUNCH')}</div>
                    <div className="aside-cell" style={{height: cellHeight + 'px'}}>{trans('DINNER')}</div>
                </div>
                <div className="calendar-sheet-container meals-sheet">
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
                                                    edit={edit}
                                                    context={context}
                                                    counts={meals[key] ? meals[key][type] : _.times(_.size(DIETS), _.constant(0))}
                                                    guestsCount={guestsCount} />
                                            )
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {edit &&
                        <div className="meal-buttons" style={{marginTop: monthHeight + headHeight + 'px'}}>
                            {_.map(MEAL_TYPES, (type) => {
                                return (
                                    <div key={'mealType-' + type} className="buttons-container" style={{height: cellHeight + 'px'}}>
                                        <Button onClick={() => {this.updateCount(type, 'minus');}} className="meal-button minus-one" bsSize="small">-1</Button>
                                        <Button onClick={() => {this.updateCount(type, 'plus');}} className="meal-button plus-one" bsSize="small">+1</Button>
                                        <Button onClick={() => {this.updateCount(type, 'none');}} className="meal-button none" bsSize="small">{trans('NOBODY')}</Button>
                                        <Button onClick={() => {this.updateCount(type, 'all');}} className="meal-button all" bsSize="small">{trans('ALL')}</Button>

                                    </div>
                                );
                            })}
                        </div>}
                </div>
                <EditTools edit={edit} saving={saving} onSave={this.save} onCancel={this.cancel} />
            </div>
        );
    }
});

module.exports = Meals;
