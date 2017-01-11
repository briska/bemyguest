const trans = require('core/utils/trans');
const React = require('react');
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

let ConfirmDialog = React.createClass({
    propTypes: {
        body: React.PropTypes.node,
        buttonText: React.PropTypes.string,
        cancelText: React.PropTypes.string,
        confirmBSStyle: React.PropTypes.string,
        confirmText: React.PropTypes.node,
        showCancelButton: React.PropTypes.bool.isRequired,
        visible: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            cancelText: trans('CANCEL'),
            confirmText: trans('OK'),
            confirmBSStyle: 'primary',
            showCancelButton: true,
        };
    },

    getInitialState() {
        return {
            isOpened: this.props.visible,
            body: this.props.body || ''
        };
    },

    open(onConfirm, onCancel) {
        this.setState({
            isOpened: true,
            onConfirm: onConfirm,
            onCancel: onCancel
        });
    },

    openWithMsg(msg, onConfirm, onCancel) {
        this.setState({
            isOpened: true,
            body: msg,
            onConfirm: onConfirm,
            onCancel: onCancel
        });
    },

    onClose() {
        this.setState({
            isOpened: false,
        });
        if (this.state.onCancel) {
            this.state.onCancel();
        }
    },

    onConfirm() {
        this.setState({
            isOpened: false,
        });
        if (this.state.onConfirm) {
            this.state.onConfirm();
        }
    },

    render() {
        let cancelButton = this.props.showCancelButton ? (<Button bsStyle="default" onClick={this.onClose}>{this.props.cancelText}</Button>) : null;
        return (
            <Modal ref='confirmDialog' dialogClassName='confirmDialog' show={this.state.isOpened} onHide={this.onClose}>
                <Modal.Body>
                    {this.state.body}
                </Modal.Body>
                <Modal.Footer>
                    {cancelButton}
                    <Button bsStyle={this.props.confirmBSStyle} onClick={this.onConfirm}>{this.props.confirmText}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = ConfirmDialog;
