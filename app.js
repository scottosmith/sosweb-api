import express, { request } from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';
import gqlResolver from './graphql/resolvers/index';
import gqlSchema from './graphql/schema/index';
import isAuthorized from './middleware/is-authorized';

const app = express();

app.use(bodyParser.json());

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
        return response.sendStatus(200);
    }
    next();
});
app.use(isAuthorized);

app.use('/api', graphqlHttp({
    schema: gqlSchema(),
    rootValue: gqlResolver,
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
