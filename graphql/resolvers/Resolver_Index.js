const user_resolver = require('./user_resolver');
const event_resolver = require('./event_resolver');
const booking_resolver = require('./booking_resolver');

const root_resolver = {
    ...user_resolver,
    ...event_resolver,
    ...booking_resolver
};
module.exports = root_resolver;