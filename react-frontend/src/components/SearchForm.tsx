import React, { useState, useEffect, useRef } from 'react';

interface SearchFormProps {
    initialSearch: string;
    onSearch: (searchTerm: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({initialSearch, onSearch}) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const lastSearchTerm = useRef(initialSearch);

      // Update search term when initialSearch changes

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
        <div className='mb-4'>
            <div className='row'>
                <div className='col-md-8 col-lg-6 mx-auto'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder='Search for food products...'
                        />
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => {
                                onSearch(searchTerm);
                                lastSearchTerm.current = searchTerm;
                            }}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};