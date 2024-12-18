// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config')
config.tesyMatch = ['**/*.spec.ts']
module.exports = config
