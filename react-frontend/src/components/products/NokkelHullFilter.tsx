// NokkelhullFilter.tsx
import { Button } from '../common/Button';

interface NokkelhullFilterProps {
    value: boolean | null;
    onChange: (value: boolean | null) => void;
}

export function NokkelhullFilter({ value, onChange }: NokkelhullFilterProps) {
    return (
        <div className="btn-group" role="group" aria-label="Nøkkelhull filter">
            <Button
                variant={value === true ? 'success' : 'outline-success'}
                onClick={() => onChange(true)}
            >
                <i className="fa fa-key me-2"></i>
                Nøkkelhull
            </Button>
            <Button
                variant={value === false ? 'danger' : 'outline-danger'}
                onClick={() => onChange(false)}
            >
                <i className="fa fa-circle-xmark me-2"></i>
                Not Nøkkelhull
            </Button>
            {value !== null && (
                <Button
                    variant="outline-secondary"
                    onClick={() => onChange(null)}
                >
                    <i className="fa fa-x me-2"></i>
                    Clear Filter
                </Button>
            )}
        </div>
    );
}