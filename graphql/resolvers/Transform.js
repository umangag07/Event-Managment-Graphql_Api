const { convert_date } = require('../../Helpers/Date');
const Event = require('../../model/event');
const User = require('../../model/user');

const events = async eventIds=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return Transform_event(event);
        });
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
        date: convert_date(event.date),
        creator: user.bind(this, event._doc.creator)
    };
};

const user = async userID=>{
    // eslint-disable-next-line no-useless-catch
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

const Transform_booking = booking =>{
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: single_event.bind(this, booking.event),
        createdAt: convert_date(booking._doc.createdAt),
        updatedAt: convert_date(booking._doc.updatedAt),
    };
};

exports.events = events;
exports.user = user;
exports.single_event = single_event;
exports.Transform_event = Transform_event;
exports.Transform_booking = Transform_booking;
