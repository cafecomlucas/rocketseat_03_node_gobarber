module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off', // nos métodos da classe, permite usar funções ou variáveis sem o this (como o console.log)
    'no-param-reassign': 'off', // necessário para setar valores padrão em argumentos de funções
    camelcase: 'off', // aceita variáveis declaradas fora do padrão 'camelCase'
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }], // variável next do express que será declarada, mas não utilizada
  },
};
