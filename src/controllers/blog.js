import Blog from "../models/blog.js";

export const fetchOneBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("Missing required params");
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(20, parseInt(req.query.limit) || 5);
        const skip = (page - 1) * limit;

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
            }
        ]);

        return res.status(201).json({ message: "Blog fetched successfully", data: blog || {} });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const fetchAllBlogs = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(20, parseInt(req.query.limit) || 5);
        const skip = (page - 1) * limit;

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
            }
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
            throw new Error("Missing required values");
        }

        const blog = new Blog({
            title,
            content,
            author,
        });

        const createdBlog = await blog.save();

        if (!createdBlog) {
            throw new Error("Blog creation failed");
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
            throw new Error("Blog not found");
        }

        existingBlog.title = title;
        existingBlog.content = content;

        const updatedBlog = await existingBlog.save();

        if (!updatedBlog) {
            throw new Error("Blog update failed");
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
            throw new Error("Blog not found");
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            throw new Error("Blog deletion failed");
        }

        return res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
