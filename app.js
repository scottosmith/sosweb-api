const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Post = require('./models/post');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

const posts = async (postIds) => {
    try {
        const matchedPosts = await Post.find({_id: {$in: postIds}});
        return matchedPosts.map(post => {
            return {...post._doc, author: user.bind(this, post.author)};
        });
    } 
    catch (error) {
        throw error;
    }
}

const user = async (userId) => {
    try {
        const userMatch = await User.findById(userId);
        return {...userMatch._doc, authoredPosts: posts.bind(this, userMatch.authoredPosts)};
    } 
    catch (error) {
        throw error;
    }
}

app.use('/api', graphqlHttp({
    schema: buildSchema(`
        type Post {
            _id: ID!
            title: String!
            body: String!
            date: String!
            author: User!
        }

        type User {
            _id: ID!
            firstName: String!
            lastName: String!
            email: String!
            password: String
            authoredPosts: [Post!]
        }

        input PostInput {
            title: String!
            body: String!
            date: String!
        }

        input UserInput {
            firstName: String!
            lastName: String!
            email: String!
            password: String!
        }

        type RootQuery {
            posts: [Post!]!
        }

        type RootMutation {
            createPost(postInput: PostInput): Post
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        posts: async () => {
            try {
                const posts = await Post.find();
                return posts.map(post => {
                    const author = user.bind(this, post.author);
                    return {...post._doc, author: author}
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
                const user = await User.findById('5eddc9b28643035b870107e2');
                if (!user) {
                    throw new Error('User not found');
                }
                user.authoredPosts.push(post);
                await user.save();
                return post;
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
                return { ...user._doc, password: null };
            } 
            catch (error) {
                throw error;
            }
        }
    },
    graphiql: true
}));

const connect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0-cbov3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
        app.listen(6943);
        console.log('Server running...');
    } 
    catch (error) {
        throw error;
    }
}
connect();
