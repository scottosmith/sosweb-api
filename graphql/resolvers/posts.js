import { transformPost } from '../../utils/relations';
import Post from '../../models/post';
import User from '../../models/user';

export const posts = async () => {
    try {
        const posts = await Post.find();
        return posts.map(post => {
            return transformPost(post);
        });
    } 
    catch (error) {
        throw error;
    }
}

export const createPost = async args => {
    try {
        const post = new Post({
            title: args.postInput.title,
            body: args.postInput.body,
            author: '5eddc9b28643035b870107e2'
        });
        await post.save();
        const postAuthor = await User.findById(post.author);
        if (!postAuthor) {
            throw new Error('User not found');
        }
        postAuthor.authoredPosts.push(post);
        await postAuthor.save();
        return transformPost(post);
    } 
    catch (error) {
        throw error;
    }
}