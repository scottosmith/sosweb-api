import { buildSchema } from 'graphql';

const gqlSchema = () => {
   return buildSchema(`
        type Post {
            _id: ID!
            title: String!
            body: String!
            author: User!
            createdAt: String!
            updatedAt: String!
        }

        type User {
            _id: ID!
            firstName: String!
            lastName: String!
            fullName: String,
            email: String!
            password: String
            authoredPosts: [Post!]
            createdAt: String!
            updatedAt: String!
        }

        type Auth {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input PostInput {
            title: String!
            body: String!
        }

        input UserInput {
            firstName: String!
            lastName: String!
            email: String!
            password: String!
        }

        type RootQuery {
            posts: [Post!]!
            users: [User!]!
            login(email: String!, password: String!): Auth!
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
}

export default gqlSchema;