const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

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

app.listen(6943);