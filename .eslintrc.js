module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'max-len': 'off',
    'no-nested-ternary': 'off',
    'global-require': 'off'
  },
  'globals': {
    "fetch": false
  }

}