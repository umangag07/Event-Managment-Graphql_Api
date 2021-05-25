const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/SchemaIndex');
const graphqlResolver = require('./graphql/resolvers/Resolver_Index');

require('dotenv/config');
const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    // type RootQuery where defining the real endpoints to fetch data
    // type RootMutation where defining the real endpoints to modify,delete or create data
    // resolver goes in the rootvalue 
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
})
);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT), console.log('connected to db'))
    .catch(err => console.log(err));




