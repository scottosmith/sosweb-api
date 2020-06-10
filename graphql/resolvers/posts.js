const { transformPost } = require('../../utils/relations');
const Post = require('../../models/post');
const User = require('../../models/user');

module.exports = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                return transformPost(post);
            });
        } 
        catch (error) {
            throw error;
        }
    },
    createPost: async args => {
        try {
            const post = new Post({
                title: args.postInput.title,
                body: args.postInput.body,
                author: '5eddc9b28643035b870107e2'
            })
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
    },
}