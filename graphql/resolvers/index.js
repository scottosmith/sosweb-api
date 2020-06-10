const usersResolver = require('./users');
const postsResolver = require('./posts');

const rootResolver = {
    ...usersResolver,
    ...postsResolver
}

module.exports = rootResolver;