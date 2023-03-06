/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.js',
    '!<rootDir>/src/**/errors.js',
    '!<rootDir>/src/**/environments.js'
  ],
  coverageProvider: 'babel',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.js'],
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  transform: {
    // '^.+\\.(js)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    // '<rootDir>/node_modules/'
  ],
  clearMocks: true
}
