module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  testMatch: ['/**/src/**/__tests__/*.test.+(ts|tsx|js)'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['cobertura', 'html', 'lcov']
};
