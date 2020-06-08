const bcrypt = require('bcryptjs');
const Post = require('../../models/post');
const User = require('../../models/user');

const fullName = (fn, ln) => {
    if (ln) {
        return fn + ' ' + ln;
    }
    return fn;
}

const posts = async (postIds) => {
    try {
        const matchedPosts = await Post.find({_id: {$in: postIds}});
        return matchedPosts.map(post => {
            return {
                ...post._doc,
                date: new Date(post.date).toISOString(),
                author: user.bind(this, post.author)
            };
        });
    } 
    catch (error) {
        throw error;
    }
}

const user = async (userId) => {
    try {
        const userMatch = await User.findById(userId);
        return {
            ...userMatch._doc,
            fullName: fullName(userMatch.firstName, userMatch.lastName),
            authoredPosts: posts.bind(this, userMatch.authoredPosts)
        };
    } 
    catch (error) {
        throw error;
    }
}

module.exports = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                const author = user.bind(this, post.author);
                return {
                    ...post._doc, 
                    date: new Date(post.date).toISOString(),
                    author: author
                }
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
                date: new Date(),
                author: '5eddc9b28643035b870107e2'
            })
            await post.save();
            const user = await User.findById(post.author);
            if (!user) {
                throw new Error('User not found');
            }
            user.authoredPosts.push(post);
            await user.save();
            return { 
                ...post._doc, 
                date: new Date(post.date).toISOString(),
                author: user.bind(this, post.author)
            };
        } 
        catch (error) {
            throw error;
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('Email already in use');
            }
            const hashPass = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                email: args.userInput.email,
                password: hashPass
            });
            await user.save();
            return { 
                ...user._doc, 
                password: null 
            };
        } 
        catch (error) {
            throw error;
        }
    }
}