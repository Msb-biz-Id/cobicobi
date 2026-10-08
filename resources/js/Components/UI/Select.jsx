import { forwardRef } from 'react';

const Select = forwardRef(function Select(
    {
        label,
        error,
        helperText,
        options = [],
        placeholder = 'Select an option',
        className = '',
        id,
        required = false,
        children,
        ...props
    },
    ref,
) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
                >
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <select
                ref={ref}
                id={inputId}
                required={required}
                className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900 dark:text-white ${
                    error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
                        : 'border-slate-200 focus:border-indigo-600 dark:border-slate-700/80 dark:focus:border-indigo-500'
                } ${className}`}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {children
                    ? children
                    : options.map((opt) => (
                          <option
                              key={typeof opt === 'object' ? opt.value : opt}
                              value={typeof opt === 'object' ? opt.value : opt}
                          >
                              {typeof opt === 'object' ? opt.label : opt}
                          </option>
                      ))}
            </select>
            {error && <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{error}</p>}
            {helperText && !error && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
            )}
        </div>
    );
});

export default Select;
