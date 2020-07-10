import { transformPost } from '../../utils/relations';
import Post from '../../models/post';
import User from '../../models/user';
import authorize from '../../utils/authorize';

export const posts = async (args, request) => {
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

export const createPost = async (args, request) => {
    try {
        authorize(request);
        const post = new Post({
            title: args.postInput.title,
            body: args.postInput.body,
            author: request.userId
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

export const removePost = async (args, request) => {
    try {
        authorize(request);
        const post = await Post.findById(args.postId);
        const postAuthor = await User.findById(post.author);
        postAuthor.authoredPosts.pop(post);
        await postAuthor.save();
        await Post.findOneAndDelete({_id: args.postId});
        return "Post Removed!";
    } 
    catch (error) {
        throw error;
    }
}