module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    preset: '@shelf/jest-mongodb',
};