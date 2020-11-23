const test = require('ava')
const {
  registerDatabase,
  registerWordPressAPI,
  registerBlocksHandler
} = require('.')

test('database', async t => {
  // Load and throw error as no connection
  await t.throwsAsync(registerDatabase({
    host: 'localhost',
    database: 'test',
    user: 'root',
    password: 'secure'
  }), {
    instanceOf: Error,
    message: 'Unable to find post rows in database. Please check your credentials.'
  })
})

test('api', async t => {
  // Load
  let req
  await t.notThrowsAsync(async () => {
    req = (await registerWordPressAPI({
      baseUrl: 'https://localhost',
      username: 'test',
      password: 'secure'
    })).req
  })

  // Got function
  t.true(req instanceof Function)
})

test('blocks', async t => {
  // Load
  let handler
  await t.notThrowsAsync(async () => {
    handler = (await registerBlocksHandler()).handler
  })

  // Got function
  t.true(handler instanceof Function)

  // Valid handler
  t.is(await handler('<p>Test</p>'), '<!-- wp:paragraph -->\n<p>Test</p>\n<!-- /wp:paragraph -->')
})
