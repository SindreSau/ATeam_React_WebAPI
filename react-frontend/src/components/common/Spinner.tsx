// src/components/Spinner.tsx
interface SpinnerProps {
    fullPage?: boolean;  // Optional prop to center in full viewport
    size?: 'sm' | 'md' | 'lg';  // Optional size prop
}

const Spinner = ({fullPage = false, size = 'md'}: SpinnerProps) => {
    const getSizeClass = () => {
        switch (size) {
            case 'sm':
                return 'spinner-border-sm text-primary';
            case 'lg':
                return 'spinner-border text-primary spinner-border-lg';
            default:
                return 'spinner-border text-primary';
        }
    };

    const spinner = (
        <div className={getSizeClass()} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    if (fullPage) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                {spinner}
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center p-3">
            {spinner}
        </div>
    );
};

export default Spinner;