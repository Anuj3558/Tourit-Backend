import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import TouristUser from "../model/userModel.js";
import Destination from "../model/destinatioin.js";
import Booking from "../model/booking.js";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.example.com',
    port: 587, // or 465 for SSL
    secure: false,
    auth: {
        user: "anujmahadik63@gmail.com",
        pass: "wimp rkoz qljm kpew"
    }
});
const handleRegister = async (req, res) => {
    const { userName, userEmail, userPass, userAddress } = req.body;

    if (!userName || !userEmail || !userPass || !userAddress) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {

        const existingUser = await TouristUser.findOne({ email: userEmail });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPass, salt);


        const registeredUser = await TouristUser.create({
            name: userName,
            email: userEmail,
            password: hashedPassword,
            address: userAddress,
        });

        console.log("User registered successfully");

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: registeredUser._id,
                name: registeredUser.name,
                email: registeredUser.email,
                address: registeredUser.address,
            },
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const handleLogin = async (req, res) => {
    const { userEmail, password } = req.body;
    try {
        const user = await TouristUser.find({ email: userEmail });
        if (!user) {
            return res.status(403).send("Email does not Exits ");
        }
        const result = await bcrypt.compare(password, user[0].password)
        if (!result) {
            return res.status(400).send("Invalid Password");
        }
        const pass = user[0].password;
        const id = jwt.sign({
            userEmail,
            pass
        }, process.env.SECERET_KEY, { expiresIn: '24h' })
        res.status(200).send(id).cookie('_id', id);
    }
    catch (err) {
        res.status(500).send("Internal server error");
        console.log(err);
    }
}


const handleAuth = async (req, res) => {
    try {
        const token = req?.cookies._id;
        
        // if (!token) {
        //     return res.status(400).send("No token");
        // }
        // const decoded = jwt.verify(token, process.env.SECERET_KEY);
        // const email = decoded.userEmail;
        // const password = decoded.pass;
        // const user = await TouristUser.find({ email: email, password: password })
        // if (!user[0]) {
        //     return res.status(401).send("Invalid Token");
        // }
        res.status(200).send(token);

    }
    catch (err) {
        res.status(500).send("Internal server Error"+err);
    }
}
const handlePopularDest = async (req, res) => {
    try {
        const destinations = await Destination.find({ type: "popular" });
        if (!destinations) {
            return res.status(400).send("No destinations Found");
        }
        res.status(200).send(destinations);
    }
    catch (err) {
        res.status(500).send("Internal server error")
        console.log(err);
    }
}
const HandlePackage = async (req,res) =>{
    try {
        const destinations = await Destination.find();
        if (!destinations) {
            return res.status(400).send("No destinations Found");
        }
        res.status(200).send(destinations);
    }
    catch (err) {
        res.status(500).send("Internal server error")
        console.log(err);
    }
}
const BookTrip = async (req, res) => {
    const { name, email, phone, numberOfPeople, trip } = req.body;
    const token = req.cookies._id;

    if (!token) {
        return res.status(400).send("No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECERET_KEY);
        const userEmail = decoded.userEmail;
        const password = decoded.pass;

        const user = await TouristUser.findOne({ email: userEmail, password: password });

        if (!user) {
            return res.status(401).send("Invalid Token");
        }

        if (!name || !email || !phone || !numberOfPeople || !trip) {
            return res.status(400).json({ message: 'All fields are required' });
        }
  
        const tripCity = trip.name;
        const tripDate = new Date(trip.date);
        const status = "Pending";

        const booking = await Booking.create({
            name,
            email,
            phone,
            noOfPeople: Number(numberOfPeople),
            tripCity,
            tripDate,
            bookingStatus: status
        });

      

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation',
            text: `Dear ${name},\n\nYour booking for ${tripCity} on ${tripDate.toDateString()} has been successfully created.\n\nBooking Status: ${status}\n\nThank you for booking with us!\n\nBest Regards,\nTravel Agency`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json(booking);

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const GetDetails = async (req, res) => {
    const id = req.params.id;

    try {

        const SingleDestination = await Destination.findById(id);
        if (!SingleDestination) {
            return res.status(400).send("NO data found");
        }
        res.status(200).send(SingleDestination);
    }
    catch (err) {
        console.log(err);
    }
}
const GenerateResult = async(req, res) => {
  
    const { destination, rating } = req.query;
    
  
    console.log(`Destination: ${destination}, Date: ${rating}`);
    
    try {
        const result = await Destination.find({location:destination,rating:{$gt:rating}});
      res.status(200).json({
        message: 'Results generated successfully',
        data: {
          destination,
          
        },
        result
      });
    } catch (error) {
      console.error('Error generating results:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
export { BookTrip, GetDetails, handleRegister, GenerateResult,handleLogin, handleAuth, handlePopularDest,HandlePackage };
