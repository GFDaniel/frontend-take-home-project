const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.css$': 'jest-transform-stub',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['/node_modules/(?!some-module).+\\.(js|jsx|ts|tsx)$'],
}

module.exports = createJestConfig(customJestConfig)