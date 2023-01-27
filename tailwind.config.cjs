/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        gridTemplateColumns: {                
            'messenger': '320px 1fr',
            'main': '55px 1fr',
        },
        gridTemplateRows: {
            'chat': '65px 1fr',
            'main': '60px 1fr'
        },
        height: {
            '18': '4.5rem' 
        },
        keyframes: {
            hide: {
              '0%': { opacity: 1 },
              '100%': { opacity: 0 },
            }
        },
        animation: {
            hide: 'hide 3s ease-in-out 1',
        }
      },
    },
    plugins: [
        require('autoprefixer'),
        plugin(function({ addVariant }) {
            addVariant('hocus', ['&:hover', '&:focus'])
        }),
        plugin(({ addUtilities }) => {
            addUtilities({
              ".no-overflow-anchoring": {
                overflowAnchor: "none",
              },
            });
        })
    ],
  }