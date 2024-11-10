// Select.tsx
import {SelectHTMLAttributes} from "react";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
    error?: string;
    fullWidth?: boolean;
    customSize?: 'sm' | 'md' | 'lg';
}

export function Select({
                           options,
                           label,
                           error,
                           className = '',
                           fullWidth = false,
                           customSize = 'md',
                           ...props
                       }: SelectProps) {
    const selectClasses = [
        'form-select',
        customSize !== 'md' && `form-select-${customSize}`,
        error && 'is-invalid',
        fullWidth && 'w-100',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={`${fullWidth ? 'w-100' : ''}`}>
            {label && (
                <label htmlFor={props.id} className="form-label">
                    {label}
                </label>
            )}
            <select className={selectClasses} {...props}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}