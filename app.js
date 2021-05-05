const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./model/event');

require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    // type RootQuery where defining the real endpoints to fetch data
    // type RootMutation where defining the real endpoints to modify,delete or create data
    // resolver goes in the rootvalue 
    schema: buildSchema(`
        type Event{
            _id: ID
            title: String!
            description: String!
            date: String!
            price: Float
        }
        input EventInput {
            title:String!
            description:String!
            price:Float!
            date:String!
        }
        type RootQuery {
            events:[Event!]!

        }
        type RootMutation{
            createEvent(eventInput:EventInput):Event
        }   
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            const Data = Event.find();
            return Data;

        }, createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)

            });
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }

    },
    graphiql: true
})
);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT), console.log('connected to db'))
    .catch(err => console.log(err));




