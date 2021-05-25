/* eslint-disable no-useless-catch */
const Booking = require('../../model/booking');
const Event = require('../../model/event');
const { Transform_event, Transform_booking } = require('./Transform');

module.exports = {
    bookings:async ()=>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return Transform_booking(booking);
            });
        } catch (err) {
            throw err;
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
            return Transform_booking(result);
            
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