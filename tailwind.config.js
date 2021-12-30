module.exports = {
  content: ['./src/**/*.{html,js,pug}'],
  theme: {
    extend: {
      colors: {
        "dark-blue": '#001845',
        "baby-blue": "#85AFFF",
        "dark-orange": "#DD6E42"
      },
      minHeight: {
        '80': '20rem',
      },
      keyframes: {
        lift: {
          to: {
            'box-shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            transform: 'translate(0, -4px)'
          }
        }
      },
      animation: {
        lift: 'lift 0.25s ease forwards',
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) forwards',
      }
    }
  }
}