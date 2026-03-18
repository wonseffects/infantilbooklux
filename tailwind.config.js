/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#000033',
                    dark: '#020617',
                },
                purple: {
                    DEFAULT: '#4b0082',
                    dark: '#1e1b4b',
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
