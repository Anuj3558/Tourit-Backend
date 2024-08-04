import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or path to image
    required: true
  },
  days: {
    type: String,
    required: true
  },
  people: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: String, // Could be changed to Number if you want to store price as a numeric value
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  highlights: {
    type: [String],
    required: true
  },
  itinerary: {
    type: [String],
    required: true
  },
  mapLink: {
    type: String,
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['normal', 'popular'],
    required: true
  },
  publicId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
