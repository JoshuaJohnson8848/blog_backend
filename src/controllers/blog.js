import mongoose from "mongoose";
import Blog from "../models/blog.js";

export const fetchOneBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("Missing required params");
        }

        const blog = await Blog.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.author",
                    foreignField: "_id",
                    as: "commentAuthors"
                }
            },
            {
                $addFields: {
                    author: "$author.fullName",
                    comments: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                _id: "$$comment._id",
                                comment: "$$comment.comment",
                                postId: '$$comment.postId',
                                createdAt: "$$comment.createdAt",
                                updatedAt: "$$comment.updatedAt",
                                author: {
                                    $arrayElemAt: [
                                        {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$commentAuthors",
                                                        as: "user",
                                                        cond: { $eq: ["$$user._id", "$$comment.author"] }
                                                    }
                                                },
                                                as: "u",
                                                in: "$$u.fullName"
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    },

                    totalComments: { $size: "$comments" }
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    author: 1,
                    totalComments: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: 1
                }
            }
        ]);

        return res.status(201).json({ message: "Blog fetched successfully", data: blog?.[0] || {} });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchAllBlogs = async (req, res, next) => {
    try {
        const { keyword, pageParam, limitParam } = req.query;

        const page = Math.max(1, parseInt(pageParam) || 1);
        const limit = Math.min(20, parseInt(limitParam) || 5);
        const skip = (page - 1) * limit;

        let matchCondition = {};

        if (keyword) {
            matchCondition.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } }
            ];
        }

        const blogs = await Blog.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            },
            {
                $addFields: {
                    author: "$author.fullName",
                    totalComments: { $size: "$comments" },
                    comments: {
                        $slice: [
                            {
                                $map: {
                                    input: "$comments",
                                    as: "comment",
                                    in: {
                                        _id: "$$comment._id",
                                        comment: "$$comment.comment",
                                        createdAt: "$$comment.createdAt",
                                        updatedAt: "$$comment.updatedAt"
                                    }
                                }
                            },
                            skip,
                            limit
                        ]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    author: 1,
                    totalComments: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: 1
                }
            },
            { $match: matchCondition }
        ]);

        return res.status(201).json({ message: "Blog fetched successfully", data: blogs || [] });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchMyBlogs = async (req, res, next) => {
    try {
        const { keyword, pageParam, limitParam } = req.query;
        const { userId } = req;

        const page = Math.max(1, parseInt(pageParam) || 1);
        const limit = Math.min(20, parseInt(limitParam) || 5);
        const skip = (page - 1) * limit;

        let matchCondition = {};

        if (keyword) {
            matchCondition.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } }
            ];
        }

        const blogs = await Blog.aggregate([
            {
                $match: {
                    author: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            },
            {
                $addFields: {
                    author: "$author.fullName",
                    totalComments: { $size: "$comments" },
                    comments: {
                        $slice: [
                            {
                                $map: {
                                    input: "$comments",
                                    as: "comment",
                                    in: {
                                        _id: "$$comment._id",
                                        comment: "$$comment.comment",
                                        createdAt: "$$comment.createdAt",
                                        updatedAt: "$$comment.updatedAt"
                                    }
                                }
                            },
                            skip,
                            limit
                        ]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    author: 1,
                    totalComments: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: 1
                }
            },
            { $match: matchCondition }
        ]);
        return res.status(201).json({ message: "Blog fetched successfully", data: blogs || [] });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createBlog = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { userId: author } = req;

        if (title == "" || content == "") {
            const error = new Error('Missing required fields');
            error.status = 422;
            throw error;
        }

        const blog = new Blog({
            title,
            content,
            author,
        });

        const createdBlog = await blog.save();

        if (!createdBlog) {
            const error = new Error('Blog creation failed');
            error.status = 422;
            throw error;
        }

        return res.status(201).json({ message: "Blog created successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            const error = new Error('Blog not found');
            error.status = 404;
            throw error;
        }

        existingBlog.title = title;
        existingBlog.content = content;

        const updatedBlog = await existingBlog.save();

        if (!updatedBlog) {
            const error = new Error('Blog update failed');
            error.status = 422;
            throw error;
        }

        return res.status(200).json({ message: "Blog updated successfully", data: updateBlog });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            const error = new Error('Blog not found');
            error.status = 422;
            throw error;
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            const error = new Error('Blog deletion failed');
            error.status = 422;
            throw error;
        }

        return res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
