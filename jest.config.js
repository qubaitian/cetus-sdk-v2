const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // Reshaping TypeScript with ts-jest
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'], // Specify the root directory for test files
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/',
    }),
    '^@/(.*)$': '<rootDir>/packages/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.[jt]s?(x)', '**/__tests__/**/*.[jt]s?(x)'], // Match test files
  collectCoverage: false, // Enable code coverage
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**', '!**/*.test.{ts,tsx}', '!**/*.d.ts'],
  coverageDirectory: '<rootDir>/coverage', // Coverage report output directory
  verbose: true,
  runner: 'jest-runner',
  testRunner: 'jest-circus/runner',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 30000,
}
