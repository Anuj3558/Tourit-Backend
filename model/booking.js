import mongoose, { Schema } from "mongoose";


const BookingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    noOfPeople: {
        type: String, 
        required: true
    },
    tripCity: {
        type: String,
        required: true
    },
    tripDate: { 
        type: Date, 
        required: true
    },
    bookingStatus: {
        type: String,
        default: 'Pending', 
        required: true
    }
}, { timestamps: true });

BookingSchema.index({ email: 1, tripCity: 1 }, { unique: true });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
