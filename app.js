import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';
import gqlResolver from './graphql/resolvers/index';
import gqlSchema from './graphql/schema/index';

const app = express();
app.use(bodyParser.json());

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
