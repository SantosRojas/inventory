import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Tipo unificado para Select que acepta diferentes estructuras
type SelectItem = {
  id: number | string;
  name: string;
  code?: string;
  [key: string]: unknown;
};

interface SelectProps {
  items: SelectItem[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  emptyMessage?: string;
  formatOption?: (item: SelectItem) => string;
}

const Select: React.FC<SelectProps> = ({
  items,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  label,
  error,
  disabled = false,
  emptyMessage = "No hay opciones disponibles",
  formatOption = (item) => item.name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Encontrar el item seleccionado
  const selectedItem = items.find(item => item.id === value);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
          handleSelect(items[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (item: SelectItem) => {
    onChange(item.id);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Input principal */}
      <div 
        className={`
          relative w-full px-3 py-2 border rounded-md cursor-pointer bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${selectedItem ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedItem ? formatOption(selectedItem) : placeholder}
          </span>
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.id}
                className={`
                  px-3 py-2 cursor-pointer flex items-center justify-between
                  ${index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${value === item.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                `}
                onClick={() => handleSelect(item)}
                role="option"
                aria-selected={value === item.id}
              >
                <span className="truncate">{formatOption(item)}</span>
                {value === item.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-center">
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

export default Select;
