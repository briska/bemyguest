const _ = require('lodash');
const React = require('react');
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

let EditTools = React.createClass({
    render: function() {
        let {edit, saving, onSave, onCancel, onRemove, note} = this.props;
        if (saving || !edit) {
            return null;
        } else {
            return (
                <div className="edit-tools">
                    {onCancel &&
                        <Button className="form-group-button cancel" onClick={onCancel}><Glyphicon glyph="remove" /></Button>}
                    {onRemove &&
                        <Button bsStyle="danger" className="form-group-button remove" onClick={onRemove}><Glyphicon glyph="trash" /></Button>}
                    {onSave &&
                        <Button bsStyle="success" className="form-group-button save" onClick={onSave}><Glyphicon glyph="ok" /></Button>}
                    {note &&
                        <span className="form-group-button note text-warning">{note}</span>}
                </div>
            );
        }
    }
});

module.exports = EditTools;

