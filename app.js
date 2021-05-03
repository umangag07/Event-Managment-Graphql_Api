const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

require('dotenv/config');

const app = express();
const Events = [];

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
            return Events;
           
        }, createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                date: args.eventInput.date,
                price: +args.eventInput.price
            };
            Events.push(event);
            return event;

        }

    },
    graphiql: true
})
);


app.listen(process.env.PORT);

