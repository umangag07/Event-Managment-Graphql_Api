
const Event = require('../../model/event');
const User = require('../../model/user');
const { Transform_event } = require('./Transform');



module.exports = {
    events: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const events = await Event.find();
            return events.map(event => {
                return Transform_event(event);
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
};