import * as usersResolver from './users';
import * as postsResolver from './posts';

const gqlResolver = {
    ...usersResolver,
    ...postsResolver
}

export default gqlResolver;