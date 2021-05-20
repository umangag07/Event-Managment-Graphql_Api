const bcrypt = require('bcrypt');
const Event = require('../../model/event');
const User = require('../../model/user');
const Booking = require('../../model/booking');

const events = eventIds=>{
    return Event.find({_id:{$in:eventIds}})
        .then(events=>{
            return events.map(event=>{
                return {
                    ...event._doc,
                    _id:event.id,
                    date:new Date(event.date).toISOString(),
                    creator: user.bind(this,event.creator)
                };
            });
        })
        .catch(err=>{
            throw err;
        });
           
};

const user = userID=>{
    return User.findById(userID)
        .then(user=>{
            return {
                ...user._doc,
                _id:user.id,
                password:null,
                createdEvents:events.bind(this,user.createdEvents)};
        })
        .catch(err=>{
            throw err;
        });
};

const singleEvent = eventId=>{
    return Event.findById(eventId)
        .then(event=>{
            return {
                ...event._doc,
                creator: user.bind(this,event.creator)
            };
        })
        .catch(err=>{
            throw err;
        });
};

const salt = 12;

module.exports = {
    events: () => {
        return Event.find()
            .then(events=>{
                return events.map(event=>{
                    return{
                        ...event._doc,
                        _id:event.id,
                        date:new Date(event.date).toISOString(),
                        creator:user.bind(this, event._doc.creator)
                    };
                });
            })
            .catch(err=>{
                throw err;
            });

    },
    bookings:()=>{
        return Booking.find()
            .then(bookings=>{
                return bookings.map(booking=>{
                    return{
                        ...booking._doc,
                        _id:booking.id,
                        user:user.bind(this,booking._doc.user),
                        event:singleEvent(this,booking._doc.event),
                        createdAt:new Date(booking._doc.createdAt).toISOString(),
                        updatedAt:new Date(booking._doc.updatedAt).toISOString(),
                    };
                });
            })
            .catch(err=>{
                throw err;
            });
        
    
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:'60941d63863d634278eb494d'

        });
        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = { ...result._doc };
                console.log(result);
                return User.findById('60941d63863d634278eb494d');
              
                
                
            })
            .then(user=>{
                if(!user){
                    throw new Error('User not found');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(()=>{
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    createUser: (args) => {
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
    },
    bookEvent:(args)=>{
        return Event.findOne({_id:args.eventId})
            .then(result=>{
                if(result){
                    const booking = new Booking({
                        user:'60941d63863d634278eb494d',
                        event:result
                    });
                    return booking.save()
                        .then(result=>{
                            return {
                                ...result._doc,
                                _id:result.id,
                                user:user.bind(this,result._doc.user),
                                event:singleEvent(this,result._doc.event),
                                createdAt:new Date(result._doc.createdAt).toISOString(),
                                updatedAt:new Date(result._doc.updatedAt).toISOString(),
                            };
                        })
                        .catch(err=>{
                            throw err;
                        });
                }
            })
            .catch(err=>{
                throw err;
            });
    }
};