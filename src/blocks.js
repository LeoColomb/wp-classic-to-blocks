/**
 * Load Browser-like environment with `window` and `document`
 */
require('browser-env')()

/**
 * Load polyfills required for WordPress Blocks loading
 */
require('polyfill-library/polyfills/__dist/matchMedia/raw')
require('polyfill-library/polyfills/__dist/requestAnimationFrame/raw')

/**
 * WordPress Blocks dependencies
 */
const { registerCoreBlocks } = require('@wordpress/block-library')
const { rawHandler, serialize } = require('@wordpress/blocks')

exports.registerBlocksHandler = async () => {
  registerCoreBlocks()

  const handler = async (renderedContent) => {
    serialize(rawHandler({
      HTML: renderedContent
    }))
  }

  return {
    handler
  }
}
