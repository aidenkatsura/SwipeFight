/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFiles: ["./jestSetup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(firebase|@firebase|react-native|@react-native|@react-navigation)/)"
  ]
};