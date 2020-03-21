module.exports = {
    coverageDirectory: 'reports/coverage',
    coverageReporters: ['lcov', 'html'],
    moduleNameMapper: {
        '~/(.*)': '<rootDir>/src/$1',
    },
    preset: 'ts-jest'
};
