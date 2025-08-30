import User from '../models/user.js'
import bcrypt from 'bcryptjs';

export const fetchOneUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            const error = new Error('Missing required field');
            error.status = 422;
            throw error;
        }

        const user = await User.findById(id).select({
            email: 1,
            fullName: 1,
            isActive: 1,
            phone: 1,
            userType: 1
        });

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        return res.status(201).json({ message: "User fetched successfully", data: user || {} });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchAllUserByType = async (req, res, next) => {
    try {
        const { type } = req.query;

        if (!type) {
            const error = new Error('Missing required field');
            error.status = 422;
            throw error;
        }

        const users = await User.find({ userType: type }).select({
            email: 1,
            fullName: 1,
            isActive: 1,
            phone: 1,
            userType: 1
        });

        return res.status(201).json({ message: "User fetched successfully", data: users || [] });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, isActive, userType } = req.body;

        if (!fullName || !email || !phone || !password) {
            const error = new Error('Missing required field');
            error.status = 422;
            throw error;
        }

        const existingUser = await User.findOne({ where: { email: email } }).select({ email: 1 });

        if (existingUser) {
            const error = new Error('User with same email already exist');
            error.status = 422;
            throw error;
        }

        const hashPass = await bcrypt.hash(password, 12);

        if (!hashPass) {
            const error = new Error('Password hasing failed');
            error.status = 422;
            throw error;
        }

        const user = new User({
            fullName,
            email,
            phone,
            password: hashPass,
            isActive,
            userType
        });

        const createdUser = await user.save();

        if (!createdUser) {
            const error = new Error('User creation failed');
            error.status = 422;
            throw error;
        }

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, isActive } = req.body;

        const existingUser = await User.findById(id);

        if (!existingUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        existingUser.fullName = fullName;
        existingUser.email = email;
        existingUser.phone = phone;
        existingUser.isActive = isActive;

        const updatedUser = await existingUser.save();

        if (!updatedUser) {
            const error = new Error('User update failed');
            error.status = 422;
            throw error;
        }

        return res.status(200).json({ message: "User updated successfully", data: updatedUser });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingUser = await User.findById(id);

        if (!existingUser) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            const error = new Error('User deletion failed');
            error.status = 422;
            throw error;
        }

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};