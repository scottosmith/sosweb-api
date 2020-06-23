import * as usersResolver from './users';
import * as postsResolver from './posts';
import * as loginResolver from './login';

const gqlResolver = {
    ...usersResolver,
    ...postsResolver,
    ...loginResolver
}

export default gqlResolver;