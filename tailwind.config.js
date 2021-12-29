module.exports = {
  content: ['./src/**/*.{html,js,pug}'],
  theme: {
    extend: {
      // Adds a new breakpoint in addition to the default breakpoints
      minHeight: {
        '80': '20rem',
      }
    }
  }
}