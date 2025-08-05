import React, { useState, useCallback } from 'react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minLength?: number;
  allowClear?: boolean; // Nueva prop para permitir limpiar
  id?: string; // Agregar prop opcional para ID
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = "Buscar...", 
  disabled = false,
  minLength = 1, // Valor por defecto de 1 para mantener compatibilidad
  allowClear = true, // Permitir limpiar por defecto
  id
}) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Solo buscar si cumple con el mínimo de caracteres
      if (value.length >= minLength) {
        onSearch(value);
      }
    }
  }, [value, onSearch, minLength]);

  const handleSubmit = useCallback(() => {
    // Solo buscar si cumple con el mínimo de caracteres
    if (value.length >= minLength) {
      onSearch(value);
    }
  }, [value, onSearch, minLength]);

  const handleClear = useCallback(() => {
    setValue('');
    if (allowClear) {
      onSearch('');
    }
  }, [onSearch, allowClear]);

  // El botón está deshabilitado si no cumple el mínimo o está vacío
  const isButtonDisabled = disabled || value.length < minLength;

  return (
    <div className="flex-1 flex space-x-2">
      <div className="flex-1 relative">
        <input
          id={id || "search-input"}
          name="search"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          autoComplete="off"
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {value && allowClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title={value.length === 0 ? "Escribe algo para buscar" : value.length < minLength ? `Mínimo ${minLength} caracteres` : "Buscar"}
      >
        🔍
      </button>
    </div>
  );
};

export default SearchInput;
