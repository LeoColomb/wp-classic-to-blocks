/**
 *
 */

const { registerDatabase } = require('./src/database.js')
const { registerWordPressAPI } = require('./src/wp-api.js')
const { registerBlocksHandler } = require('./src/blocks.js')

exports = {
  registerDatabase,
  registerWordPressAPI,
  registerBlocksHandler
}
