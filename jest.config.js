module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!lit-html).+\\.js'],
  setupFiles: ['<rootDir>/jest.globals.js'],
};
