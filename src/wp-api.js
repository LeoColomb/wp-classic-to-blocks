const got = require('got')

exports.registerWordPressAPI = async ({ baseUrl, username, password, ip = null, insecure = false, options = {} }) => {
  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  if (ip) {
    // TODO: improve direct resolution handler
    options.lookup = (hostname, options, callback) => (callback || options)(null, ip, 4)
  }

  const api = got.extend({
    searchParams: { context: 'edit' },
    prefixUrl: `${baseUrl}/wp-json/wp/v2/posts`,
    username,
    password,
    ...options
  })

  const req = async (postID) => {
    const response = await api(postID.toString()).json()
    return response.body.content.rendered
  }

  return {
    req
  }
}
