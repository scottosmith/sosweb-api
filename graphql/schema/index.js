const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
        fullName: String,
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
`)