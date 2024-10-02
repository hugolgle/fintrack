// .eslintrc.js
module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    requireConfigFile: false, // Ne pas nécessiter un fichier de configuration Babel
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  rules: {
    // Ajoutez vos règles ici
    "no-console": "warn", // Avertir sur l'utilisation de console.log
    "no-unused-vars": "warn", // Avertir sur les variables inutilisées
  },
  settings: {
    react: {
      version: "detect", // Détecter la version de React
    },
  },
};
