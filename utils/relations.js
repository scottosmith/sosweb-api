import { fullName, prettyDate } from './helpers';
import Post from '../models/post';
import User from '../models/user';

//#region Build Relationships <3
const postRelation = async (postIds) => {
    try {
        const matchedPosts = await Post.find({_id: {$in: postIds}});
        return matchedPosts.map(post => {
            return transformPost(post);
        });
    } 
    catch (error) {
        throw error;
    }
}

const userRelation = async (userId) => {
    try {
        const user = await User.findById(userId);
        return transformUser(user);
    } 
    catch (error) {
        throw error;
    }
}
//#endregion

//#region Transformations
// transform user data to new user object
export const transformUser = user => {
    return {
        ...user._doc, 
        fullName: fullName(user.firstName, user.lastName),
        createdAt: prettyDate(user.createdAt),
        updatedAt: prettyDate(user.updatedAt),
        password: null,
        authoredPosts: postRelation.bind(this, user.authoredPosts)
    };
}

// transform post data to new post object
export const transformPost = post => {
    return {
        ...post._doc,
        createdAt: prettyDate(post.createdAt),
        updatedAt: prettyDate(post.updatedAt),
        author: userRelation.bind(this, post.author)
    };
}
//#endregion
