import { Router } from 'express';
import { createBlog, deleteBlog, fetchAllBlogs, fetchMyBlogs, fetchOneBlog, updateBlog } from '../controllers/blog.js';
import { authenticate } from '../middleware/authentication.js';

const router = Router();

router.get("/my", authenticate, fetchMyBlogs);

router.get("/:id", fetchOneBlog);

router.get("/", fetchAllBlogs);

router.post("/", authenticate, createBlog);

router.put("/:id", authenticate, updateBlog);

router.delete("/:id", authenticate, deleteBlog);

export default router;