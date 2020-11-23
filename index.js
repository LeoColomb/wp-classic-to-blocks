/**
 * WordPress Classic to Blocks
 *
 * WordPress Classic to Blocks Content Mass Converter
 *
 * @licence ISC
 * @author Léo Colombaro
 */

exports.registerDatabase = require('./src/database.js').registerDatabase
exports.registerWordPressAPI = require('./src/wp-api.js').registerWordPressAPI
exports.registerBlocksHandler = require('./src/blocks.js').registerBlocksHandler
