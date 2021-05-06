const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./model/event');
const User = require('./model/user');

const salt = 12;

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
        type User{
            _id:ID
            email:String!
            password:String
        }
        input EventInput {
            title:String!
            description:String!
            price:Float!
            date:String!
        }
        input UserInput{
            email:String!
            password:String!
        }
        type RootQuery {
            events:[Event!]!
            

        }
        type RootMutation{
            createEvent(eventInput:EventInput):Event
            createUser(userInput:UserInput):User
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
        }, createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('User exist already');
                    } 
                    return bcrypt.hash((args.userInput.password), salt);
                        
                }).then(hash => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hash
                    });
                    return user.save();
                })
                .then(result => {
                    console.log(result);
                    return { ...result._doc, _id: result.id, password: null };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
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




