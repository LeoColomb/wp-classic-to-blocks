const { Form, Confirm } = require('enquirer')
const ProgressBar = require('progress')
const c = require('ansi-colors')

const {
  registerDatabase,
  registerWordPressAPI,
  registerBlocksHandler
} = require('.')

;(async () => {
  // Database
  const promptDb = await (new Form({
    name: 'db',
    header: c.yellow('Please provide carefully the following information'),
    message: 'Database',
    choices: [
      { name: 'host', message: 'Host', initial: 'localhost' },
      { name: 'database', message: 'Name' },
      { name: 'user', message: 'Username' },
      { name: 'password', message: 'Password' },
      { name: 'prefix', message: 'Prefix', initial: 'wp_' }
    ]
  }))
    .run()
  const { db, query, count } = await registerDatabase({
    host: promptDb.host,
    database: promptDb.database,
    user: promptDb.user,
    password: promptDb.password
  }, promptDb.prefix)

  // WP API
  const promptApi = await (new Form({
    name: 'api',
    message: 'WordPress API',
    choices: [
      { name: 'baseUrl', message: 'Base URL', initial: 'https://localhost' },
      { name: 'username', message: 'Username' },
      { name: 'password', message: 'Password' },
      { name: 'ip', message: 'IP address' }
    ]
  }))
    .run()
  const { req } = await registerWordPressAPI({ ...promptApi, insecure: true })

  // Blocks
  const { handler } = await registerBlocksHandler()

  // Confirmation
  const confirmProcessing = await (new Confirm({
    name: 'continue',
    header: c.red(`About to process ${c.bold(count)} rows`),
    message: 'Continue?'
  })).run()
  if (!confirmProcessing) {
    throw new Error('Aborted')
  }

  // Processing
  const progress = new ProgressBar(`${c.bold('[:bar]')} :percent (:current/:total, :rate r/s)`, {
    total: count,
    width: 30
  })
  await query.select('ID')
    .stream((rowStream) => {
      rowStream.on('data', async ({ ID }) => {
        progress.tick()
        try {
          const contentClassic = await req(ID)
          const contentBlocks = handler(contentClassic)
          await db.where({ ID })
            .update({ post_content: contentBlocks })
        } catch (e) {
          console.error(`Post ${ID} is erroneous`, e)
        }
      })
    })
})().then(() => {})
