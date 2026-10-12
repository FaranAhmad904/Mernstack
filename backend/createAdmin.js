const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const hashedPassword = await bcrypt.hash(
            "123456",
            10
        );

        const admin = await User.create({
            name: "ShopHub Admin",
            email: "admin@shophub.com",
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin created successfully");
        console.log(admin);

        process.exit();

    } catch (error) {

        console.error(
            "Error creating admin:",
            error.message
        );

        process.exit(1);
    }
};

createAdmin();