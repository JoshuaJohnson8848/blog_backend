import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        postId: {
            type: Types.ObjectId,
            ref: 'Blog',
            required: true
        },
        author: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;