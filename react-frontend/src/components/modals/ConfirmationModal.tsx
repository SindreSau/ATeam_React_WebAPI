import React from 'react';
import {Button, ButtonVariant} from '../common/Button';
import {useEscapeKey} from "../../hooks/useEscapeKey";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    primaryButtonVariant?: ButtonVariant;
    isLoading?: boolean;
}

const ConfirmationModal = React.memo(({
                                          isOpen,
                                          onClose,
                                          onConfirm,
                                          title = 'Confirm Action',
                                          message = 'Are you sure you want to proceed?',
                                          confirmText = 'Confirm',
                                          cancelText = 'Cancel',
                                          primaryButtonVariant = 'primary',
                                          isLoading = false
                                      }: ConfirmationModalProps) => {
    // Close modal on escape key press
    useEscapeKey(onClose);

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{display: 'block'}}
            />

            {/* Modal */}
            <div
                className="modal fade show"
                tabIndex={-1}
                role="dialog"
                style={{display: 'block'}}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body">
                            <p>{message}</p>
                        </div>

                        <div className="modal-footer">
                            <Button
                                variant="light"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={primaryButtonVariant}
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <span className="spinner-border spinner-border-sm me-2" role="status"/>
                                )}
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

// Add display name
ConfirmationModal.displayName = 'ConfirmationModal';

export default ConfirmationModal;