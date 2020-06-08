const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();
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
            return Post.find()
            .then(posts => {
                return posts.map(post => {
                    return {...post._doc};
                })
            }).catch(err => {
                throw err;
            });
        },
        createPost: args => {
            const post = new Post({
                title: args.postInput.title,
                body: args.postInput.body,
                date: new Date()
            })
            return post.save().then(result => {
                return {...result._doc};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0-cbov3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(6943);
        console.log('Server running...');
    }).catch(err => {
        console.log(err);
    });
