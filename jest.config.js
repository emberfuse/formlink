module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    setupFiles: ['<rootDir>/tests/setup.js'],
};
