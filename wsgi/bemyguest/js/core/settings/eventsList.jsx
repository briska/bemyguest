const _ = require('lodash');
const React = require('react');
const trans = require('core/utils/trans');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
const moment = require('moment');
require('moment/locale/sk');
const connectToStores = require('fluxible-addons-react/connectToStores');
const EventsStore = require('core/eventsStore');
const cx = require('classnames');
import {translateEventType} from 'core/utils/utils';
import Modal from 'react-bootstrap/lib/Modal';
import EventDetail from 'core/settings/eventDetail';
import actions from 'core/actions';
import {DAY_FORMAT} from 'core/enums';
import ConfirmDialog from 'core/utils/confirmDialog';

let EventsList = React.createClass({
    getStateFromSource: function(propsSrc) {
        return {
            edit: null,
            saving: false,
            show: false
        };
    },

    getInitialState: function() {
        return this.getStateFromSource(this.props);
    },

    startEditing: function(event) {
        this.setState({edit: event, show: true});
    },

    close: function() {
        this.setState({show: false});
    },

    save: function() {
        let event = this.refs['event-' + this.state.edit.id].getEvent();
        let isValid = this.refs['event-' + this.state.edit.id].isValid();
        if (!isValid) {
            alert(trans('ALL_FIELDS_REQUIRED'));
            return;
        }
        event.dateFrom = _.isEmpty(event.dateFrom) ? null : moment(event.dateFrom).format(DAY_FORMAT);
        event.dateTo =  _.isEmpty(event.dateTo) ? null : moment(event.dateTo).format(DAY_FORMAT);
        let payload = {
            event: event
        };
        this.setState({saving: true});
        if (event.id == null) {
            this.props.context.executeAction(actions.createEvent, payload);
        } else {
            this.props.context.executeAction(actions.editEvent, payload);
        }
    },

    remove: function(event) {
        this.refs.deleteEvent.open(() => {
            this.close();
            let payload = {
                'id': event.id
            };
            this.props.context.executeAction(actions.removeEvent, payload);
        }, ()=> {
            return;
        });
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.saving) {
            this.setState(this.getStateFromSource(nextProps));
        }
    },

    render: function() {
        let {edit, show} = this.state;
        let events = this.props.events;
        let eventModal = (
            <Modal dialogClassName="event-details-modal" bsSize="lg" show={show} onHide={this.close}>
                <Modal.Header closeButton />
                <Modal.Body>
                    {edit &&
                        <EventDetail
                            ref={'event-' + edit.id}
                            context={this.props.context}
                            event={edit} />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.save}>{trans('SAVE')}</Button>
                    <Button onClick={this.close}>{trans('CANCEL')}</Button>
                </Modal.Footer>
            </Modal>
        );
        return (
            <div className="events sub-section">
                <h2>{trans('EVENTS')}</h2>
                <ConfirmDialog
                    ref="deleteEvent"
                    body={trans('CONFIRM_REMOVING_EVENT')}
                    confirmBSStyle="danger"/>
                <div className="week-selector">
                    <Button onClick={() => this.startEditing("open_empty")} bsSize="small" bsStyle="primary">
                        {trans('NEW_EVENT')}
                    </Button>
                </div>
                <table className={cx('events-list-table', 'sub-section-table')}>
                    <thead>
                        <tr>
                            <td>{trans('EVENT_NAME')}</td>
                            <td>{trans('FROM')} - {trans('TO')}</td>
                            <td>{trans('EVENT_TYPE')}</td>
                            <td>{trans('EVENT_COLOR')}</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(events, (event, i) => {
                            let bothDates = event.dateFrom.format('L');
                            if (event.dateTo != null) {
                                bothDates = bothDates + " - " + event.dateTo.format('L');
                            }
                            return (
                                <tr key={'event-' + event.id} onDoubleClick={() => this.startEditing(event)}>
                                    <td>{event.name}</td>
                                    <td>{bothDates}</td>
                                    <td>{trans('EVENT_TYPE_NAME.' + translateEventType(event.type))}</td>
                                    <td className={'event-color-preview-' + event.color}></td>
                                    <td><Glyphicon glyph="trash" onClick={() => this.remove(event)}/></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {eventModal}
            </div>
        );
    }
});

EventsList = connectToStores(EventsList, [EventsStore], (context, props) => ({
    events: context.getStore(EventsStore).getEvents()
}));

module.exports = EventsList;
