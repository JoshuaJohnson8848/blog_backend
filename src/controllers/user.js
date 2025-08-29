import User from '../models/user.js'
import bcrypt from 'bcryptjs';

export const fetchOneUser = async(req, res, next) => {
    try {
        const { id } = req.params;

        if(!id) {
            throw new Error("Missing required params");
        }

        const user = await User.findById(id).select({ 
            email: 1,
            fullName: 1,
            isActive: 1,
            phone: 1,
            userType: 1
        });

        if(!user) {
            throw new Error("User not found");
        }

        return res.status(201).json({ message: "User fetched successfully", data: user || {} });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchAllUserByType = async(req, res, next) => {
    try {
        const { type } = req.query;

        if(!type) {
            throw new Error("Missing required params");
        }

        const users = await User.findOne({ userType: type }).select({ 
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

export const createUser = async(req, res, next) => {
    try {
        const { fullName, email, phone, password, isActive, userType } = req.body;

        if(!fullName || !email || !phone || !password) {
            throw new Error("Missing required values");
        }

        const existingUser = await User.findOne({ where :{ email: email }}).select({ email: 1 });

        if(existingUser) {
            throw new Error("User with the same email already exist");
        }

        const hashPass = await bcrypt.hash(password, 12);

        if(!hashPass) {
            throw new Error("Password hashing failed");
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

        if(!createdUser) {
            throw new Error("User creation failed");            
        }

        return res.status(201).json({ message: "User created successfully"});

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, isActive } = req.body;

        const existingUser = await User.findById(id);

        if(!existingUser) {
            throw new Error("User not found");
        }

        existingUser.fullName = fullName;
        existingUser.email = email;
        existingUser.phone = phone;
        existingUser.isActive = isActive;

        const updatedUser = await existingUser.save();

        if(!updatedUser) {
            throw new Error("User update failed");            
        }

        return res.status(200).json({ message: "User updated successfully", data: updatedUser});

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteUser = async(req, res, next) => {
    try {
        const { id } = req.params;

        const existingUser = await User.findById(id);

        if(!existingUser) {
            throw new Error("User not found");
        }

        const deletedUser = await User.deleteOne({ wehre: { id } });

        if(!deletedUser) {
            throw new Error("User deletion failed");            
        }

        return res.status(200).json({ message: "User deleted successfully"});

    } catch (error) {
        console.log(error);
        next(error);
    }
};