import JWT from "jsonwebtoken";
import User, { UserTypeEnum } from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            throw new Error("Missing required values");
        }

        const existingUser = await User.findOne({ where: { email: email } }).select({ email: 1 });

        if (existingUser) {
            throw new Error("User with the same email already exist");
        }

        const hashPass = await bcrypt.hash(password, 12);

        if (!hashPass) {
            throw new Error("Password hashing failed");
        }

        const user = new User({
            fullName,
            email,
            password: hashPass,
            isActive: true,
            userTypes: UserTypeEnum.USER
        });

        const createdUser = await user.save();

        if (!createdUser) {
            throw new Error("User creation failed");
        }

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Missing required values");
        }

        const existingUser = await User.findOne({ email }).select("+password")
        
        if (!existingUser) {
            throw new Error("Login Failed");
        }

        const comparePass = await bcrypt.compare(password, existingUser.password);

        if (!comparePass) {
            throw new Error("Incorrect Password");
        }

        const token = JWT.sign(
            { userId: existingUser.id, email: existingUser.email, role: existingUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        return res.status(201).json({ message: "User loggedin successfully", user: existingUser, token: token });

    } catch (error) {
        console.log(error);
        next(error);
    }
};