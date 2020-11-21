const knex = require('knex')

exports.registerDatabase = async ({ host, database, user, password, prefix }) => {
  const db = knex({
    client: 'mysql2',
    connection: {
      host,
      database,
      user,
      password
    }
  })
    .from(`${prefix}posts`)

  const query = db
    .where({
      post_type: 'post',
      post_status: 'publish'
    })
    .whereNotNull('post_content')
    .andWhereNot('post_content', 'like', '<!-- wp:%')
    .orderBy('ID')
    .limit(10)

  let count
  try {
    count = await query.clone().count()
    count = count[0]['count(*)']
  } catch (e) {
    console.error(e)
    throw new Error('Unable to find post rows in database. Please check your credentials.')
  }

  return {
    db,
    query,
    count
  }
}
