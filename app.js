const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const posts = [];

app.use(bodyParser.json());

app.use('/api', graphqlHttp({
    schema: buildSchema(`
        type Post {
            _id: ID!
            title: String!
            body: String!
            date: String!
        }

        input PostInput {
            title: String!
            body: String!
            date: String!
        }

        type RootQuery {
            posts: [Post!]!
        }

        type RootMutation {
            createPost(postInput: PostInput): Post
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        posts: () => {
            return posts;
        },
        createPost: (args) => {
            const post = {
                _id: Math.random().toString(),
                title: args.postInput.title,
                body: args.postInput.body,
                date: new Date().toISOString()
            }
            posts.push(post);
            return post;
        }
    },
    graphiql: true
}));

const connect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0-cbov3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
        app.listen(process.env.DB_PORT);
        console.log('Server running...');
    } 
    catch (error) {
        throw error;
    }
}
connect();
