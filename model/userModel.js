import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
});


UserSchema.index({ email: 1 }, { unique: true });

const TouristUser = model("TouristUser", UserSchema);
export default TouristUser;
