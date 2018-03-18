// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  env: {
    browser: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue','html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    "indent": ["off", 4],
    'linebreak-style': 'off',
    'no-param-reassign': 'off',
    'func-names':'off',
    'no-extend-native':'off',
    'no-plusplus':'off',
    'no-prototype-builtins':'off',
    'radix':'off',
    'max-len':'off',
    'eqeqeq':'off',
    'no-console':'off',
    'no-lonely-if':'off', 
    "invalid-first-character-of-tag-name":'off',
    "vue/no-side-effects-in-computed-properties":"off",
    "no-trailing-spaces":"off",
    "Newline required at end of file but not found":"off",
    "eol-last":"off",
    "spaced-comment":"off",
    "no-multiple-empty-lines":"off",
    "no-multi-spaces  ":"off",
    "no-irregular-whitespace ":"off",
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
