import {useEffect, useState} from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    type: ToastType;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    autoDismiss?: boolean;
    autoDismissTimeout?: number;
    title?: string;
}

const getToastConfig = (type: ToastType) => {
    switch (type) {
        case 'success':
            return {
                bgClass: 'text-bg-success',
                icon: 'fa-circle-check'
            };
        case 'error':
            return {
                bgClass: 'text-bg-danger',
                icon: 'fa-circle-exclamation'
            };
        case 'warning':
            return {
                bgClass: 'text-bg-warning',
                icon: 'fa-triangle-exclamation'
            };
        case 'info':
            return {
                bgClass: 'text-bg-info',
                icon: 'fa-circle-info'
            };
        default:
            return {
                bgClass: 'text-bg-secondary',
                icon: 'fa-circle-info'
            };
    }
};

const Toast = ({
                   type,
                   message,
                   isVisible,
                   onClose,
                   autoDismiss = true,
                   autoDismissTimeout = 5000,
                   title
               }: ToastProps) => {
    const [isShowing, setIsShowing] = useState(isVisible);
    const config = getToastConfig(type);

    useEffect(() => {
        setIsShowing(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (autoDismiss && isVisible) {
            const timer = setTimeout(() => {
                setIsShowing(false);
                onClose();
            }, autoDismissTimeout);

            return () => clearTimeout(timer);
        }
    }, [autoDismiss, autoDismissTimeout, isVisible, onClose]);

    if (!isShowing) return null;

    return (
        <div
            className={`toast show position-fixed bottom-0 start-0 m-3 ${config.bgClass}`}
            role="alert"
            style={{zIndex: 1050}}
        >
            <div className="toast-body">
                <div className="d-flex gap-4">
                    <span>
                        <i className={`fa-solid ${config.icon} fa-lg`}></i>
                    </span>
                    <div className="d-flex flex-grow-1 align-items-center justify-content-between">
                        <div>
                            {title && <div className="fw-semibold mb-1">{title}</div>}
                            <span>{message}</span>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white ms-3"
                            onClick={() => {
                                setIsShowing(false);
                                onClose();
                            }}
                            aria-label="Close"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;