
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#121212',
                primary: '#22c55e',
                card: '#1e1e1e',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                'safe': 'env(safe-area-inset-bottom)',
            }
        },
    },
    plugins: [],
}
