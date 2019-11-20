module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(j|t)s$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!lit-html).+\\.js'],
  setupFiles: ['<rootDir>/jest.globals.js'],
  testRegex: '.test.(j|t)s$',
};
