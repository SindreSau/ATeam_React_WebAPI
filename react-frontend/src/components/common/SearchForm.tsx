import React, {useState, useEffect, useRef, memo} from 'react';

interface SearchFormProps {
    initialSearch: string;
    onSearch: (searchTerm: string) => void;
}

export const SearchForm = memo(({ initialSearch, onSearch }: SearchFormProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const lastSearchTerm = useRef(initialSearch);

    useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        if (searchTerm !== lastSearchTerm.current) {
            const timeoutId = setTimeout(() => {
                onSearch(searchTerm);
                lastSearchTerm.current = searchTerm;
            }, 400);
            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="input-group">
            <span className="input-group-text border-end rounded-2">
                <i className="fa fa-search text-muted"></i>
            </span>
            <input
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search for food products..."
                aria-label="Search products"
            />
            <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => {
                    onSearch(searchTerm);
                    lastSearchTerm.current = searchTerm;
                }}
            >
                Search
            </button>
        </div>
    );
});

SearchForm.displayName = 'SearchForm';