module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/workers/**',
    '!src/config/**'
  ],
  setupFilesAfterEnv: ['./tests/setup.js']
};