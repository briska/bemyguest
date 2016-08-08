'use strict';

var _reactBootstrap = require('react-bootstrap');

var _actions = require('core/actions');

var _actions2 = _interopRequireDefault(_actions);

var _meal = require('core/calendar/editReservation/meal');

var _meal2 = _interopRequireDefault(_meal);

var _enums = require('core/enums');

var _utils = require('core/utils/utils');

var _calendarHeader = require('core/calendar/calendarHeader');

var _calendarHeader2 = _interopRequireDefault(_calendarHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var React = require('react');
var trans = require('core/utils/trans');

var moment = require('moment');
require('moment/locale/sk');


var Meals = React.createClass({
    displayName: 'Meals',

    getInitialState: function getInitialState() {
        return {
            edit: false,
            saving: false,
            guestsCount: this.props.guestsCount
        };
    },

    startEditing: function startEditing() {
        this.setState({ edit: true });
    },

    cancel: function cancel() {
        _.each(this.refs, function (meal) {
            meal.cancel();
        });
        this.setState({ edit: false });
    },

    save: function save() {
        var _this = this;

        this.setState({ saving: true });
        var meals = _.map(this.props.datesRange, function (date, i) {
            return {
                date: date,
                counts: _.map(_enums.MEAL_TYPES, function (type) {
                    return _this.refs['mealD' + i + 'T' + type].getCounts();
                })
            };
        });
        var payload = {
            'id': this.props.reservationId,
            'data': {
                'meals': meals
            }
        };
        this.props.context.executeAction(_actions2.default.editReservation, payload);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.saving) {
            this.setState({ saving: false, edit: false });
        }
    },

    render: function render() {
        var _state = this.state;
        var edit = _state.edit;
        var saving = _state.saving;
        var _props = this.props;
        var meals = _props.meals;
        var datesRange = _props.datesRange;

        return React.createElement(
            'div',
            { className: 'meals form-group', onDoubleClick: this.startEditing },
            React.createElement(
                'h4',
                null,
                trans('MEALS')
            ),
            edit && !saving && React.createElement(
                _reactBootstrap.Button,
                { className: 'form-group-button cancel', onClick: this.cancel },
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove' })
            ),
            edit && !saving && React.createElement(
                _reactBootstrap.Button,
                { bsStyle: 'success', className: 'form-group-button save', onClick: this.save },
                React.createElement(_reactBootstrap.Glyphicon, { glyph: 'ok' })
            ),
            React.createElement(
                'div',
                { className: 'meal-types calendar-aside', style: { marginTop: _enums.monthHeight + 'px' } },
                React.createElement('div', { className: 'aside-cell', style: { height: _enums.headHeight + 'px' } }),
                React.createElement(
                    'div',
                    { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                    trans('BREAKFAST')
                ),
                React.createElement(
                    'div',
                    { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                    trans('LUNCH')
                ),
                React.createElement(
                    'div',
                    { className: 'aside-cell', style: { height: _enums.cellHeight + 'px' } },
                    trans('DINNER')
                )
            ),
            React.createElement(
                'div',
                { className: 'calendar-sheet-container' },
                React.createElement(
                    'div',
                    { className: 'calendar-sheet', style: { width: _.size(datesRange) * _enums.cellWidth + 'px' } },
                    React.createElement(_calendarHeader2.default, { context: context, dates: datesRange }),
                    React.createElement(
                        'div',
                        { className: 'calendar-table' },
                        _.map(_enums.MEAL_TYPES, function (type) {
                            return React.createElement(
                                'div',
                                { className: 'calendar-row' },
                                _.map(datesRange, function (date, i) {
                                    return React.createElement(_meal2.default, {
                                        key: 'meal-' + i + '-' + type,
                                        ref: 'mealD' + i + 'T' + type,
                                        edit: edit,
                                        context: context,
                                        counts: meals[date] ? meals[date][type] : _.times(_.size(_enums.DIETS), _.constant(0)) });
                                })
                            );
                        })
                    )
                )
            )
        );
    }
});

module.exports = Meals;