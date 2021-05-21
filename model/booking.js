const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookingSchema  = new Schema(
    {
        event:{
            type:Schema.Types.ObjectId,
            ref:'Event'
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {timestamps:true} // adds created at and updated at entry automatically
);

module.exports = mongoose.model('Booking', BookingSchema);