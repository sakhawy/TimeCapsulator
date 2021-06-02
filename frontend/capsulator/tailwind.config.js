module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    
    extend:{
      outline: {
        primary: ['2px dashed #545454', '1px'],
        secondary: ['2px dashed #bdbdbd', '1px'],
      },
      spacing: {
        '128': "32rem",
        '1/12': "8.33%",
        '2/12': "16.66%",
        '3/12': "25%",
        '4/12': "33.33%",
        '5/12': "41.66%",
        '7/12': "58.33%",
        '6/12': '50%',
        '8/12': "66.66%",
        '9/12': "75%",
        '10/12': "83.33%",
        '11/12': "91.66%",
        '12/12': "100%",
      },
      animation: {
        scale: 'scale 5s ease-in-out infinite'
      },
      keyframes: {
        scale:{
          '0%, 100%': {transform: 'scale(0.8)'},
          '50%': {transform: 'scale(1)'}
        }
      }
    },
    colors:{
      primary: "#545454",
      secondary: "#bdbdbd",
      black: "#000000"
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
