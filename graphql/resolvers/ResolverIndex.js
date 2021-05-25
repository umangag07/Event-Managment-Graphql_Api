/* eslint-disable no-useless-catch */
const bcrypt = require('bcrypt');
const Event = require('../../model/event');
const User = require('../../model/user');
const Booking = require('../../model/booking');

const events = async eventIds=>{
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return Transform_event(event);
        });
    } catch (err) {
        throw err;
    }
           
};

const user = async userID=>{
    try {
        const user = await User.findById(userID);
        return {
            ...user._doc,
            _id: user.id,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

const single_event = async eventId =>{
    // eslint-disable-next-line no-useless-catch
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event._doc.creator)
        };
    } catch (err) {
        throw err;
    }
};

const Transform_event =  event =>{
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
    };
};

const salt = 12;

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return Transform_event(event);
            });
        } catch (err) {
            throw err;
        }

    },
    bookings:async ()=>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: single_event.bind(this, booking.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            throw err;
        }
        
    
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:'60941d63863d634278eb494d'

        });
        let createdEvent;
        try {
            const result_1 = await event
                .save();
            createdEvent = Transform_event(result_1);
            console.log(result_1);
            const user = await User.findById('60941d63863d634278eb494d');
            if (!user) {
                throw new Error('User not found');
            }
            user.createdEvents.push(event);
            await user.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) => {
        try {
            try {
                const user = await User.findOne({ email: args.userInput.email });
                if (user) {
                    throw new Error('User exist already');
                }
                const hash = await bcrypt.hash((args.userInput.password), salt);
                const user_1 = new User({
                    email: args.userInput.email,
                    password: hash
                });
                const result = await user_1.save();
                console.log(result);
                return { ...result._doc, _id: result.id, password: null };
            } catch (err) {
                console.log(err);
                throw err;
            }
        } catch (err_1) {
            console.log(err_1);
            throw err_1;
        }
    },
    bookEvent:async (args)=>{
        try {
            const fetchedeventID = await Event.findOne({ _id: args.eventId });
           
            const booking = new Booking({
                user: '60941d63863d634278eb494d',
                event: fetchedeventID
            });
            const result = await booking.save();
            console.log(result);
            return {
                ...result._doc,
                _id: result.id,
                user: user.bind(this, result._doc.user),
                event: single_event.bind(this, result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString(),
            };
            
        } catch (err_1) {
            throw err_1;
        }
    },
    cancelBooking:async(args)=>{
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = Transform_event(booking.event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }catch(err){
            throw err;
        }

    }
};