const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const gqlSchema = require('./graphql/schema/index');
const gqlResolvers = require('./graphql/resolvers/index');

const app = express();
app.use(bodyParser.json());

app.use('/api', graphqlHttp({
    schema: gqlSchema,
    rootValue: gqlResolvers,
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
