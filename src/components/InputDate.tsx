import React, { useMemo, useState, useEffect } from 'react';

interface DateInputProps {
  label?: string;
  name?:string
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const getDaysInMonth = (year: string, month: string): number => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  if (!y || !m || m < 1 || m > 12) return 31;
  return [
    31,
    (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ][m - 1];
};

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  error,
  helperText,
  value = '',
  onChange,
  disabled,
  className = '',
  id,
}) => {
  const inputId = useMemo(() =>
    id || `input-${Math.random().toString(36).slice(2, 11)}`,
    [id]
  );

  const [date, setDate] = useState<string>(value ?? '');

  useEffect(() => {
    setDate(value ?? '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let year = val.slice(0, 4);
    let month = val.slice(4, 6);
    let day = val.slice(6, 8);

    if (month.length === 2 && parseInt(month, 10) > 12) month = '12';

    if (day.length === 2 && year.length === 4 && month.length === 2) {
      const maxDay = getDaysInMonth(year, month);
      if (parseInt(day, 10) > maxDay) {
        day = maxDay.toString().padStart(2, '0');
      }
    }

    let formatted = year;
    if (month) formatted += `-${month}`;
    if (day) formatted += `-${day}`;

    setDate(formatted);
    onChange?.(formatted);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="numeric"
        placeholder="YYYY-MM-DD"
        value={date}
        onChange={handleChange}
        maxLength={10}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200
          focus:outline-none focus:ring-2 ${className}`}
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-primary)';
          e.target.style.boxShadow = error
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{helperText}</p>
      )}
    </div>
  );
};

export default DateInput;
