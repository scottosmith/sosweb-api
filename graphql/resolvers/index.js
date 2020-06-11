import * as usersResolver from './users';
import * as postsResolver from './posts';
import * as authResolver from './auth';

const gqlResolver = {
    ...usersResolver,
    ...postsResolver,
    ...authResolver
}

export default gqlResolver;