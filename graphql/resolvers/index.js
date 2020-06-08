const bcrypt = require('bcryptjs');
const Post = require('../../models/post');
const User = require('../../models/user');

//#region Lil Helpers
const fullName = (fn, ln) => {
    if (ln) {
        return fn + ' ' + ln;
    }
    return fn;
}

const prettyDate = d => new Date(d).toISOString();
//#endregion

//#region Build Relationships <3
const posts = async (postIds) => {
    try {
        const matchedPosts = await Post.find({_id: {$in: postIds}});
        return matchedPosts.map(post => {
            return {
                ...post._doc,
                createdAt: prettyDate(post.createdAt),
                updatedAt: prettyDate(post.updatedAt),
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
//#endregion

//#region Export
module.exports = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                const author = user.bind(this, post.author);
                return {
                    ...post._doc, 
                    createdAt: prettyDate(post.createdAt),
                    updatedAt: prettyDate(post.updatedAt),
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
                author: '5eddc9b28643035b870107e2'
            })
            await post.save();
            const postAuthor = await User.findById(post.author);
            if (!postAuthor) {
                throw new Error('User not found');
            }
            postAuthor.authoredPosts.push(post);
            await postAuthor.save();
            return { 
                ...post._doc, 
                createdAt: prettyDate(post.createdAt),
                updatedAt: prettyDate(post.updatedAt),
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
            const newUser = new User({
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                email: args.userInput.email,
                password: hashPass
            });
            await newUser.save();
            return { 
                ...newUser._doc,
                createdAt: prettyDate(newUser.createdAt),
                updatedAt: prettyDate(newUser.updatedAt),
                password: null 
            };
        } 
        catch (error) {
            throw error;
        }
    }
}
//#endregion