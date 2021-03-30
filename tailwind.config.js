module.exports = {
   // purge: {
   //   content: ['./src/**/*.html', './src/**/*.tsx'],
   //   options: {
   //     safelist: ['col-start-1', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-7', 'col-start-0']
   //   }
   // },
  theme: {
    fontFamily: {
      "sans": ["'Source Sans Pro'", "sans-serif"],
    },
    extend: {
      colors: {
        red: {
          300: '#fc8e5f',
          400: '#fc785a',
          500: '#ff3331'
        },
        crema: {
          100: '#fffdfd',
          125: '#fffcec',
          150: '#fff8f7',
          200: '#fffad6',
          250: '#ffead3',
          300: '#f9f1b1 '
        },
        mostaza: {
          200: '#fcf1a1',
          300: '#fcec71'
        }
      },
      animation: {
        "slide-in-fwd-right": "slide-in-fwd-right 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both"
      },
      keyframes: {
        "slide-in-fwd-right": {
          "0%": {
            transform: "translateZ(-1400px) translateX(1000px)",
            opacity: "0"
          },
          to: {
            transform: "translateZ(0) translateX(0)",
            opacity: "1"
          }
        }
      }
    },
    variants: {
      extend: {
        backgroundColor: ['active'],
        borderColor: ['active'],
        opacity: ['disabled'],
        gridColumnStart: ['first'],
        margin: ['first', 'last', 'odd', 'even'],
        padding: ['first', 'last', 'odd', 'even'],
        fontWeight: ['first', 'last', 'odd', 'even']
      }
    }
  },
  plugins: ['animation']
}
