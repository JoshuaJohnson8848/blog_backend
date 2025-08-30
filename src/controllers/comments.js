import Comment from "../models/comments.js";

export const fetchOneComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            const error = new Error('Missing required field');
            error.status = 422;
            throw error;
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
            const error = new Error('Missing required field');
            error.status = 422;
            throw error;
        }

        const commentData = new Comment({
            comment,
            author,
            postId,
        });

        const createdComment = await commentData.save();

        if (!createdComment) {
            const error = new Error('Comment creation failed');
            error.status = 422;
            throw error;
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
            const error = new Error('Comment not found');
            error.status = 422;
            throw error;
        }

        existingComment.comment = comment;

        const updatedComment = await existingComment.save();

        if (!updatedComment) {
            const error = new Error('Comment update failed');
            error.status = 422;
            throw error;
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
            const error = new Error('Comment not found');
            error.status = 404;
            throw error;
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            const error = new Error('Comment deletion failed');
            error.status = 422;
            throw error;
        }

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
