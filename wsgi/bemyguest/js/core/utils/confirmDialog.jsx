const trans = require('core/utils/trans');
const React = require('react');
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

let ConfirmDialog = React.createClass({
    propTypes: {
        body: React.PropTypes.node.isRequired,
        buttonText: React.PropTypes.node,
        cancelText: React.PropTypes.node,
        confirmBSStyle: React.PropTypes.string,
        confirmText: React.PropTypes.node,
        showCancelButton: React.PropTypes.bool.isRequired,
        title: React.PropTypes.node.isRequired,
        visible: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            cancelText: trans('CANCEL'),
            confirmText: 'OK',
            confirmBSStyle: 'primary',
            showCancelButton: true,
        };
    },

    getInitialState() {
        if (!this.props.visible) {
            return {
                isOpened: false,
            };
        } else {
            return {
                isOpened: true,
            };
        }
    },

    open(onConfirm, onCancel) {
        this.setState({
            isOpened: true,
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

    onConfim() {
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
                    {this.props.body}
                </Modal.Body>
                <Modal.Footer>
                    {cancelButton}
                    <Button bsStyle={this.props.confirmBSStyle} onClick={this.onConfim}>{this.props.confirmText}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = ConfirmDialog;
