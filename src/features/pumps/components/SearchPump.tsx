
import { useCallback, useState, memo, useMemo } from 'react';
import { Search, X, Loader2, Barcode, ScanLine } from 'lucide-react';
import { usePumpStore } from '../store';

interface SearchPumpProps {
    disabled?: boolean;
    id?: string;
    defaultSearchType?: 'serial' | 'qr';
}

interface LastSearch {
    term: string;
    type: 'serial' | 'qr';
}

// Constantes fuera del componente para evitar recreación
const SEARCH_OPTIONS = [
    {
        type: "serial" as const,
        IconComponent: Barcode,
        label: "Serie"
    },
    {
        type: "qr" as const,
        IconComponent: ScanLine,
        label: "QR"
    }
];

const MIN_LENGTHS = {
    serial: 3,
    qr: 2
} as const;

const PLACEHOLDERS = {
    serial: 'Buscar por número de serie...',
    qr: 'Buscar por código QR...'
} as const;

const SearchPump = memo(({
    disabled = false,
    defaultSearchType = "serial"
}: SearchPumpProps) => {
    const [value, setValue] = useState('');
    const [searchType, setSearchType] = useState(defaultSearchType);
    const [lastSearch, setLastSearch] = useState<LastSearch | null>(null);

    // Optimización: Selectores individuales para evitar recreación de objetos
    const isLoading = usePumpStore((state) => state.isLoading);
    const fetchByQr = usePumpStore((state) => state.fetchByQr);
    const fetchBySerie = usePumpStore((state) => state.fetchBySerie);

    // Memoizar valores computados
    const minLength = useMemo(() => MIN_LENGTHS[searchType], [searchType]);
    const placeholder = useMemo(() => PLACEHOLDERS[searchType], [searchType]);

    const handleSearch = useCallback((term: string) => {
        if (term.length >= minLength) {
            if(searchType === "serial") {
                fetchBySerie(term)
            } else {
                fetchByQr(term)
            }
            setLastSearch({ term, type: searchType });
        }
    }, [searchType, minLength, fetchBySerie, fetchByQr]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedValue = value.trim();
            if (trimmedValue.length >= minLength) {
                handleSearch(trimmedValue);
            }
        }
    }, [value, minLength, handleSearch]);

    const handleSubmit = useCallback(() => {
        const trimmedValue = value.trim();
        if (trimmedValue.length >= minLength) {
            handleSearch(trimmedValue);
        }
    }, [value, minLength, handleSearch]);

    const handleClear = useCallback(() => {
        setValue('');
        setLastSearch(null);
    }, []);

    const handleSearchTypeChange = useCallback((newType: 'serial' | 'qr') => {
        setSearchType(newType);
        // Limpiar siempre al cambiar tipo para evitar dependencia de value
        setValue('');
        setLastSearch(null);
    }, []);

    // Memoizar lógica de estado del botón - optimizada
    const buttonState = useMemo(() => {
        const trimmedValue = value.trim();
        const hasCurrentValue = trimmedValue.length >= minLength;
        const hasSearched = lastSearch !== null;
        const hasChangedTerm = hasSearched && 
            (trimmedValue !== lastSearch.term || searchType !== lastSearch.type);
        
        const showSearchButton = !hasSearched || hasChangedTerm;
        
        return {
            showSearchButton,
            isButtonDisabled: disabled || (showSearchButton ? !hasCurrentValue : !hasSearched),
            hasSearched
        };
    }, [lastSearch, value, minLength, searchType, disabled]);

    return (
        <div className="space-y-2">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                {/* Selector de tipo de búsqueda */}
                <div className="flex">
                    {SEARCH_OPTIONS.map(({ type, IconComponent, label }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleSearchTypeChange(type)}
                            disabled={disabled}
                            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors border-r border-gray-300 last:border-r-0 ${
                                searchType === type
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <IconComponent className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Input de búsqueda */}
                <div className="flex-1 relative">
                    <input
                        id="integrated-search-input"
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        disabled={disabled}
                        className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 bg-white
                                 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Botón dinámico: búsqueda o borrado */}
                <button
                    type="button"
                    onClick={buttonState.showSearchButton ? handleSubmit : handleClear}
                    disabled={buttonState.isButtonDisabled}
                    className={`px-4 py-2.5 font-medium transition-colors border-l border-gray-300
                        ${buttonState.isButtonDisabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : buttonState.showSearchButton
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }
                    `}
                    title={buttonState.showSearchButton ? 'Buscar' : 'Limpiar búsqueda'}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : buttonState.showSearchButton ? (
                        <Search className="h-4 w-4" />
                    ) : (
                        <X className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
});

SearchPump.displayName = 'SearchPump';

export default SearchPump;