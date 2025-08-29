import Comment from "../models/comments.js";

export const fetchOneComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("Missing required params");
        }

        const comment = await Comment.findById(id);

        return res.status(201).json({ message: "Comment fetched successfully", data: comment || {} });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchAllComments = async (req, res, next) => {
    try {
        const Comments = await Comment.find();

        return res.status(201).json({ message: "Comment fetched successfully", data: Comments || [] });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { comment, postId } = req.body;
        const { userId: author } = req;

        if (comment == "" || !postId) {
            throw new Error("Missing required values");
        }

        const commentData = new Comment({
            comment,
            author,
            postId,
        });

        const createdComment = await commentData.save();

        if (!createdComment) {
            throw new Error("Comment creation failed");
        }

        return res.status(201).json({ message: "Comment created successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const existingComment = await Comment.findById(id);

        if (!existingComment) {
            throw new Error("Comment not found");
        }

        existingComment.comment = comment;

        const updatedComment = await existingComment.save();

        if (!updatedComment) {
            throw new Error("Comment update failed");
        }

        return res.status(200).json({ message: "Comment updated successfully", data: updateComment });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingComment = await Comment.findById(id);

        if (!existingComment) {
            throw new Error("Comment not found");
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            throw new Error("Comment deletion failed");
        }

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
