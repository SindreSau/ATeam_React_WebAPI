import { Button } from '../common/Button';

interface NokkelhullFilterProps {
    value: boolean | null;
    onChange: (value: boolean | null) => void;
}

export function NokkelhullFilter({ value, onChange }: NokkelhullFilterProps) {
    return (
        <div className="d-flex gap-2">
            <span className="d-flex align-items-center">Filter by Nøkkelhull:</span>
            <div
                className="btn-group"
                role="group"
                aria-label="Nøkkelhull filter"
            >
                <Button
                    variant={value === true ? 'success' : 'outline-success'}
                    onClick={() => onChange(true)}
                    title="Nøkkelhull"
                >
                    <i className="fa fa-check"></i>
                </Button>
                <Button
                    variant={value === false ? 'danger' : 'outline-danger'}
                    onClick={() => onChange(false)}
                    title="Not Nøkkelhull"
                >
                    <i className="fa fa-circle-xmark"></i>
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={() => onChange(null)}
                    title="Clear Filter"
                >
                    <i className="fa fa-x"></i>
                </Button>
            </div>
        </div>
    );
}