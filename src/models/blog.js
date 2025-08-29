import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

const BlogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog 