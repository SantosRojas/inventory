import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

// Tipo unificado para Autocomplete que acepta diferentes estructuras
type AutocompleteItem = {
  id: number;
  name: string;
  [key: string]: unknown;
};

interface AutocompleteProps {
  items: AutocompleteItem[];
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;
  id?: string;
  name?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  items,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  label,
  error,
  disabled = false,
  readOnly = false,
  emptyMessage = "No se encontraron opciones",
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Encontrar el item seleccionado
  const selectedItem = items.find(item => item.id === value);

  // Al seleccionar un item, mostrar su nombre en el input
  useEffect(() => {
    if (selectedItem && !isOpen) {
      setInputValue(selectedItem.name);
    }
  }, [selectedItem, isOpen]);

  // Filtrar items basado en el valor del input
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Restaurar el valor del input al item seleccionado
        if (selectedItem) {
          setInputValue(selectedItem.name);
        } else {
          setInputValue('');
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedItem]);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Restaurar el valor del input
        if (selectedItem) {
          setInputValue(selectedItem.name);
        } else {
          setInputValue('');
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (item: AutocompleteItem) => {
    onChange(item.id);
    setInputValue(item.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si está en modo readOnly, no permitir cambios
    if (readOnly) return;
    
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    // Si el input está vacío, limpiar la selección
    if (!newValue && value !== 0) {
      onChange(0);
    }
    
    // Si el valor exacto coincide con algún item, seleccionarlo automáticamente
    const exactMatch = items.find(item => 
      item.name.toLowerCase() === newValue.toLowerCase()
    );
    
    if (exactMatch && value !== exactMatch.id) {
      onChange(exactMatch.id);
    }
  };

  const handleInputFocus = () => {
    // Si está en modo readOnly, no abrir el dropdown
    if (readOnly) return;
    setIsOpen(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(0);
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleDropdownToggle = () => {
    if (!disabled && !readOnly) {
      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Input principal */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            ${disabled || readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        
        {/* Botones del lado derecho */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {inputValue && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full mr-1"
              tabIndex={-1}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button
            type="button"
            onClick={handleDropdownToggle}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={disabled || readOnly}
            tabIndex={-1}
          >
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`
                  px-3 py-2 cursor-pointer flex items-center justify-between transition-colors
                  ${index === highlightedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'}
                  ${value === item.id ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'}
                `}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="truncate">{item.name}</span>
                {value === item.id && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-8 text-gray-500 text-center text-sm">
              {emptyMessage}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Autocomplete;
