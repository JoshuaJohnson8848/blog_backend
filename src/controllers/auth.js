import JWT from "jsonwebtoken";
import User, { UserTypeEnum } from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            const error = new Error('Missing required fields');
            error.status = 422;
            throw error;
        }

        const existingUser = await User.findOne({ where: { email: email } }).select({ email: 1 });

        if (existingUser) {
            throw new Error("User with the same email already exist");
        }

        const hashPass = await bcrypt.hash(password, 12);

        if (!hashPass) {
            const error = new Error('Password hashing failed');
            error.status = 422;
            throw error;
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
            const error = new Error('User creation failed');
            error.status = 422;
            throw error;
        }

        return res.status(201).json({ status: true, message: "User created successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Missing required fields');
            error.status = 500;
            throw error;
        }

        const existingUser = await User.findOne({ email }).select("+password")

        if (!existingUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const comparePass = await bcrypt.compare(password, existingUser.password);

        if (!comparePass) {
            const error = new Error('Invalid Password');
            error.status = 422;
            throw error;
        }

        const token = JWT.sign(
            { userId: existingUser.id, email: existingUser.email, role: existingUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        let user = {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.fullName,
            role: existingUser.userType
        }

        return res.status(201).json({ status: true, message: "User loggedin successfully", user: user, token: token });

    } catch (error) {
        console.log(error);
        next(error);
    }
};