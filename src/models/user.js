import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

export const UserTypeEnum = {
    USER: "user",
    ADMIN: "admin"
};

const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
            maxlength: 10
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            select: false,
        },
        userType: {
            type: String,
            enum: Object.values(UserTypeEnum), 
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
export default User 