import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'var(--color-primary-50, #f0f9ff)',
                    100: 'var(--color-primary-100, #e0f2fe)',
                    200: 'var(--color-primary-200, #bae6fd)',
                    300: 'var(--color-primary-300, #7dd3fc)',
                    400: 'var(--color-primary-400, #38bdf8)',
                    500: 'var(--color-primary-500, #0284c7)',
                    600: 'var(--color-primary-600, #0369a1)',
                    700: 'var(--color-primary-700, #075985)',
                    800: 'var(--color-primary-800, #0c4a6e)',
                    900: 'var(--color-primary-900, #082f49)',
                    DEFAULT: 'var(--color-primary-500, #0284c7)',
                },
                secondary: {
                    50: 'var(--color-secondary-50, #fffbeb)',
                    100: 'var(--color-secondary-100, #fef3c7)',
                    200: 'var(--color-secondary-200, #fde68a)',
                    300: 'var(--color-secondary-300, #fcd34d)',
                    400: 'var(--color-secondary-400, #fbbf24)',
                    500: 'var(--color-secondary-500, #f59e0b)',
                    600: 'var(--color-secondary-600, #d97706)',
                    700: 'var(--color-secondary-700, #b45309)',
                    DEFAULT: 'var(--color-secondary-500, #f59e0b)',
                },
                surface: {
                    light: 'var(--color-surface-light, #ffffff)',
                    dark: 'var(--color-surface-dark, #0f172a)',
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
                heading: ['var(--font-heading)', 'Georgia', 'serif'],
            },
            boxShadow: {
                subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
                card: '0 1px 3px rgba(15, 23, 42, 0.03), 0 6px 16px rgba(15, 23, 42, 0.02)',
                floating: '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
            },
        },
    },

    plugins: [forms, typography],
};
