import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

export type ButtonVariant =
    'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
                           children,
                           variant = 'primary',
                           isLoading = false,
                           fullWidth = false,
                           className = '',
                           disabled,
                           type = 'button',
                           ...props
                       }: ButtonProps) => {
    const baseClasses = 'btn';
    const variantClass = `btn-${variant}`;
    const widthClass = fullWidth ? 'w-100' : '';
    const disabledClass = (disabled || isLoading) ? 'disabled' : '';

    const combinedClasses = [
        baseClasses,
        variantClass,
        widthClass,
        disabledClass,
        'd-inline-flex',
        'align-items-center',
        'justify-content-center',
        'h-100',  // Added this class
        'gap-2',
        className
    ].filter(Boolean).join(' ');

    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    <Spinner size="sm"/>
                    {children}
                </>
            );
        }

        return children;
    };

    return (
        <button
            type={type}
            className={combinedClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {renderContent()}
        </button>
    );
};