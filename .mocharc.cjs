module.exports = {
  require: ['@babel/register'],
  timeout: 5000,
  reporter: 'spec',
  recursive: true,
  extension: ['js'],
  spec: 'test/**/*.test.js',
  exit: true,
};
